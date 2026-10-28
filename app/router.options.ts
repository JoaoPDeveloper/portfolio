import type { RouterConfig } from 'nuxt/schema';

// Replaces (does not compose with) Nuxt's built-in scrollBehavior. Nuxt merges
// router options with object spread, so the user file wins entirely.
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const pending = useState('pendingHomeScroll').value;
    // Hash targets and cross-page section targets are scripted by useSmoothScroll.
    if (to.hash || pending) return false;
    // Initial load (Nuxt passes START_LOCATION, which has no matched records),
    // or a navigation to the same path.
    if (from.matched.length === 0 || to.path === from.path) return savedPosition ?? false;
    if (savedPosition) return savedPosition;
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce('page:loading:end', () => {
        const scrollTop = () =>
          requestAnimationFrame(() => resolve({ left: 0, top: 0 }));
        // Like the built-in behavior, wait for the page transition to finish
        // so the scroll does not jump the outgoing page mid-transition.
        const transitionPromise = nuxtApp['~transitionPromise'];
        if (transitionPromise) transitionPromise.then(scrollTop);
        else scrollTop();
      });
    });
  },
};
