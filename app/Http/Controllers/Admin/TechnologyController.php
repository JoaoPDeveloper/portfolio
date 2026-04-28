<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Technology;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TechnologyController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Technologies/Index', [
            'technologies' => Technology::query()
                ->withCount('projects')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->paginate(18)
                ->withQueryString(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Technologies/Form', [
            'technology' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $attributes = $this->validatedAttributes($request);
        $attributes['slug'] = $this->uniqueSlug($attributes['slug'] ?: $attributes['name']);
        $attributes = $this->withIconUpload($request, $attributes);

        Technology::query()->create($attributes);

        return redirect()->route('admin.technologies.index')->with('success', 'Tecnologia criada com sucesso.');
    }

    public function edit(Technology $technology): Response
    {
        return Inertia::render('Admin/Technologies/Form', [
            'technology' => $technology,
        ]);
    }

    public function update(Request $request, Technology $technology): RedirectResponse
    {
        $attributes = $this->validatedAttributes($request, $technology);
        $attributes['slug'] = $this->uniqueSlug($attributes['slug'] ?: $attributes['name'], $technology);
        $attributes = $this->withIconUpload($request, $attributes, $technology);

        $technology->update($attributes);

        return redirect()->route('admin.technologies.index')->with('success', 'Tecnologia atualizada com sucesso.');
    }

    public function destroy(Technology $technology): RedirectResponse
    {
        if ($technology->icon_path) {
            Storage::disk('public')->delete($technology->icon_path);
        }

        $technology->delete();

        return redirect()->route('admin.technologies.index')->with('success', 'Tecnologia removida.');
    }

    private function validatedAttributes(Request $request, ?Technology $technology = null): array
    {
        $technologyId = $technology?->id;

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['nullable', 'string', 'max:140', Rule::unique('technologies', 'slug')->ignore($technologyId)],
            'color' => ['nullable', 'string', 'max:32'],
            'icon_url' => ['nullable', 'url', 'max:2048'],
            'icon' => ['nullable', 'image', 'max:2048'],
            'url' => ['nullable', 'url', 'max:2048'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['boolean'],
        ]);

        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);
        $validated['is_featured'] = $request->boolean('is_featured');

        unset($validated['icon']);

        return $validated;
    }

    private function withIconUpload(Request $request, array $attributes, ?Technology $technology = null): array
    {
        if ($request->hasFile('icon')) {
            if ($technology?->icon_path) {
                Storage::disk('public')->delete($technology->icon_path);
            }

            $attributes['icon_path'] = $request->file('icon')->store('technologies', 'public');
        }

        return $attributes;
    }

    private function uniqueSlug(string $source, ?Technology $technology = null): string
    {
        $base = Str::slug($source) ?: Str::random(8);
        $slug = $base;
        $counter = 2;

        while (Technology::query()
            ->where('slug', $slug)
            ->when($technology, fn ($query) => $query->whereKeyNot($technology->id))
            ->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
