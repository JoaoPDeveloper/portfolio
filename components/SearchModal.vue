<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue';
import { Briefcase, Code, Folder, Lightbulb, X } from 'lucide-vue-next';

import { formatResultCount, useI18n } from '~/composables/useI18n';
import { useSearchActions } from '~/composables/useSearchActions';
import { useSearchIndex } from '~/composables/useSearchIndex';
import { useSearchModal } from '~/composables/useSearchModal';
import { createDebouncer } from '~/utils/debounce';
import { ENTRY_ICON } from '~/utils/searchActions';
import type { EntryType, IndexEntry } from '~/utils/searchIndex';
import {
  ensureVisibleScrollTop,
  entryToActivate,
  evaluateSwipe,
  initialSelection,
  moveSelection,
  nextTrapIndex,
} from '~/utils/searchNav';
import type { Selection } from '~/utils/searchNav';
import { MAX_RESULTS, search } from '~/utils/searchRank';
import type { SearchOutcome } from '~/utils/searchRank';

/** Debounce of the search input (Req 12.1). */
const DEBOUNCE_MS = 100;

const ICONS = { Folder, Code, Briefcase, Lightbulb } as const;

const EMPTY_OUTCOME: SearchOutcome = { mode: 'suggestions', groups: [], flat: [], count: 0 };

// Each composable is called exactly once in setup (they register lifecycle hooks).
const { t, locale } = useI18n();
const { isOpen, close } = useSearchModal();
const index = useSearchIndex();
const { activate } = useSearchActions();

const uid = useId();
const listId = `${uid}-listbox`;
const optionId = (i: number) => `${uid}-opt-${i}`;
const groupId = (type: EntryType) => `${uid}-grp-${type}`;

const dialogEl = ref<HTMLElement | null>(null);
const inputEl = ref<HTMLInputElement | null>(null);
const listEl = ref<HTMLElement | null>(null);

// ---------------------------------------------------------------- query/results

const query = ref('');
const debouncedQuery = ref('');
const selected = ref<Selection>(null);

const debouncer = createDebouncer((value: string) => {
  debouncedQuery.value = value;
}, DEBOUNCE_MS);

// While the modal is closed the last outcome is kept (so the leave transition keeps
// its content) and neither the locale nor the index is read: the index is only built
// on the first opening (Req 12.3) and a locale change while closed builds nothing.
let lastOutcome: SearchOutcome = EMPTY_OUTCOME;
const outcome = computed<SearchOutcome>(() => {
  if (!isOpen.value) return lastOutcome;
  lastOutcome = search(index.get(locale.value), debouncedQuery.value);
  return lastOutcome;
});

/** Groups with their flat position, capped at MAX_RESULTS options in the DOM (Req 12.6). */
const view = computed(() => {
  let position = 0;
  const groups: { type: EntryType; items: { entry: IndexEntry; index: number }[] }[] = [];
  for (const group of outcome.value.groups) {
    const items: { entry: IndexEntry; index: number }[] = [];
    for (const entry of group.entries) {
      if (position >= MAX_RESULTS) break;
      items.push({ entry, index: position });
      position += 1;
    }
    if (items.length > 0) groups.push({ type: group.type, items });
  }
  return groups;
});

const announcement = computed(() => formatResultCount(outcome.value.count, locale.value));
const showEmpty = computed(() => outcome.value.mode === 'results' && outcome.value.count === 0);
const activeId = computed(() => (selected.value === null ? undefined : optionId(selected.value)));

const groupLabel = (type: EntryType) => t(`search.group.${type}`);

// Opening clears the query so the suggestions show right away; closing drops a pending search.
watch(
  isOpen,
  (open) => {
    debouncer.cancel();
    if (open) {
      query.value = '';
      debouncedQuery.value = '';
    }
  },
  { flush: 'sync' },
);

// A new result list resets the selection to its first item (Req 8.1).
watch(outcome, (next) => {
  selected.value = initialSelection(next.count);
  void nextTick(() => {
    if (listEl.value) listEl.value.scrollTop = 0;
  });
});

function onInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  query.value = value;
  debouncer.call(value);
}

// ---------------------------------------------------------------- selection scroll

async function scrollSelectedIntoView(): Promise<void> {
  await nextTick();
  const list = listEl.value;
  if (!list || selected.value === null) return;
  const item = list.querySelector<HTMLElement>(`[data-index="${selected.value}"]`);
  if (!item) return;
  list.scrollTop = ensureVisibleScrollTop({
    scrollTop: list.scrollTop,
    viewportHeight: list.clientHeight,
    itemTop: item.offsetTop,
    itemHeight: item.offsetHeight,
  });
}

watch(selected, () => {
  void scrollSelectedIntoView();
});

// ---------------------------------------------------------------- focus on open

watch(
  isOpen,
  async (open) => {
    if (!open) return;
    await nextTick();
    const input = inputEl.value;
    input?.focus();
    // Req 4.9: fall back to the dialog container when the input did not take focus.
    if (!input || document.activeElement !== input) dialogEl.value?.focus();
  },
  { immediate: true },
);

// ---------------------------------------------------------------- keyboard

function onInputKeydown(event: KeyboardEvent): void {
  if (event.isComposing) return;

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    selected.value = moveSelection(selected.value, event.key, outcome.value.count);
    return;
  }

  if (event.key === 'Enter') {
    const entry = entryToActivate(selected.value, outcome.value.flat);
    if (entry) {
      event.preventDefault();
      activate(entry);
    }
  }
}

function focusableElements(): HTMLElement[] {
  const dialog = dialogEl.value;
  if (!dialog) return [];
  return Array.from(dialog.querySelectorAll<HTMLElement>('input, button:not([disabled])'));
}

function onDialogKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    if (event.isComposing) return;
    event.preventDefault();
    close();
    return;
  }

  if (event.key !== 'Tab') return;

  const items = focusableElements();
  if (items.length === 0) {
    // Nothing to move to: keep focus on the dialog (Req 10.6, 10.7).
    event.preventDefault();
    dialogEl.value?.focus();
    return;
  }

  const current = items.indexOf(document.activeElement as HTMLElement);
  const shift = event.shiftKey;
  const atEdge = current === -1 || (shift ? current === 0 : current === items.length - 1);
  if (!atEdge) return; // Native Tab order inside the dialog.

  const next = current === -1 ? (shift ? items.length - 1 : 0) : nextTrapIndex(current, items.length, shift);
  event.preventDefault();
  if (next !== null) items[next]?.focus();
}

// ---------------------------------------------------------------- backdrop

let pressStartedOnBackdrop = false;

function onBackdropDown(event: MouseEvent): void {
  pressStartedOnBackdrop = event.target === event.currentTarget;
}

function onBackdropClick(event: MouseEvent): void {
  const startedOnBackdrop = pressStartedOnBackdrop;
  pressStartedOnBackdrop = false;
  if (startedOnBackdrop && event.target === event.currentTarget) close();
}

// ---------------------------------------------------------------- swipe to close

let swipeStart: { x: number; y: number } | null = null;

function isTouchDevice(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(pointer: coarse)').matches;
}

function onSwipeStart(event: TouchEvent): void {
  const touch = event.touches[0];
  swipeStart = touch ? { x: touch.clientX, y: touch.clientY } : null;
}

function onSwipeMove(event: TouchEvent): void {
  const touch = event.touches[0];
  if (!swipeStart || !touch || !isTouchDevice()) return;
  const dx = touch.clientX - swipeStart.x;
  const dy = touch.clientY - swipeStart.y;
  if (evaluateSwipe(dx, dy) === 'close') {
    swipeStart = null;
    close();
  }
}

function onSwipeEnd(): void {
  swipeStart = null;
}

onBeforeUnmount(() => debouncer.cancel());
</script>

<template>
  <Teleport to="body">
    <Transition name="search-modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[60] flex items-start justify-center bg-[rgba(13,15,20,0.85)] px-4 pt-[10vh] backdrop-blur-xl"
        @mousedown="onBackdropDown"
        @click="onBackdropClick"
      >
        <div
          ref="dialogEl"
          role="dialog"
          aria-modal="true"
          :aria-label="t('search.dialogLabel')"
          tabindex="-1"
          class="search-dialog flex max-h-[80vh] w-full flex-col rounded-2xl border border-white/7 bg-[#0d0f14] p-4 text-[#eef1f6] focus-visible:outline-2 focus-visible:outline-[#11b5a4] sm:max-w-[640px] sm:p-6"
          style="font-family: 'Space Grotesk', system-ui, sans-serif"
          @keydown="onDialogKeydown"
        >
          <div
            data-swipe-handle
            class="flex items-center gap-3"
            @touchstart="onSwipeStart"
            @touchmove="onSwipeMove"
            @touchend="onSwipeEnd"
            @touchcancel="onSwipeEnd"
          >
            <input
              ref="inputEl"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              :aria-expanded="outcome.count > 0 ? 'true' : 'false'"
              :aria-controls="listId"
              :aria-activedescendant="activeId"
              :aria-label="t('search.inputLabel')"
              :placeholder="t('search.placeholder')"
              :value="query"
              class="h-11 min-w-0 flex-1 rounded-xl border border-white/14 bg-transparent px-3 text-base text-[#eef1f6] caret-[#11b5a4] transition-colors duration-300 placeholder:text-[#9aa3b4] focus-visible:outline-2 focus-visible:outline-[#11b5a4]"
              @input="onInput"
              @keydown="onInputKeydown"
            />
            <button
              type="button"
              :aria-label="t('search.closeLabel')"
              class="grid size-11 shrink-0 place-items-center rounded-full border border-white/14 text-[#9aa3b4] transition-colors duration-300 hover:border-[#11b5a4]/50 hover:text-white focus-visible:outline-2 focus-visible:outline-[#11b5a4]"
              @click="close()"
            >
              <X class="size-4" aria-hidden="true" />
            </button>
          </div>

          <div
            :id="listId"
            ref="listEl"
            role="listbox"
            :aria-label="t('search.dialogLabel')"
            :class="[
              'relative min-h-0 overflow-y-auto overscroll-contain',
              outcome.count > 0 ? 'mt-4' : '',
            ]"
            @mousedown.prevent
          >
            <div
              v-for="group in view"
              :key="group.type"
              role="group"
              :aria-labelledby="groupId(group.type)"
              class="mb-2 last:mb-0"
            >
              <div
                :id="groupId(group.type)"
                class="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-wider text-[#9aa3b4]"
              >
                {{ groupLabel(group.type) }}
              </div>
              <div
                v-for="item in group.items"
                :id="optionId(item.index)"
                :key="item.entry.id"
                role="option"
                :aria-selected="item.index === selected ? 'true' : 'false'"
                :data-index="item.index"
                :class="[
                  'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 hover:scale-[1.02]',
                  item.index === selected
                    ? 'bg-[rgba(17,181,164,0.15)]'
                    : 'hover:bg-[rgba(17,181,164,0.1)]',
                ]"
                style="transition: background-color 0.3s ease, transform 0.15s ease"
                @click="activate(item.entry)"
              >
                <component
                  :is="ICONS[ENTRY_ICON[item.entry.type]]"
                  class="size-4 shrink-0 text-[#11b5a4]"
                  aria-hidden="true"
                />
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm text-[#eef1f6]">{{ item.entry.title }}</div>
                  <div v-if="item.entry.description" class="truncate text-xs text-[#9aa3b4]">
                    {{ item.entry.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p v-if="showEmpty" class="mt-4 px-3 py-6 text-center text-sm text-[#9aa3b4]">
            {{ t('search.empty') }}
          </p>

          <div class="sr-only" role="status" aria-live="polite">{{ announcement }}</div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
