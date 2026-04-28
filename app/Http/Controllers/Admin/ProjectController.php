<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Technology;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Projects/Index', [
            'projects' => Project::query()
                ->with('technologies')
                ->orderBy('sort_order')
                ->orderBy('title')
                ->paginate(12)
                ->withQueryString(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Projects/Form', [
            'project' => null,
            'technologies' => $this->technologyOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $attributes = $this->validatedAttributes($request);
        $attributes['slug'] = $this->uniqueSlug($attributes['slug'] ?: $attributes['title']);
        $attributes = $this->withImageUpload($request, $attributes);

        $project = Project::query()->create(Arr::except($attributes, ['technology_ids', 'image']));
        $this->syncTechnologies($project, $attributes['technology_ids'] ?? []);

        return redirect()->route('admin.projects.index')->with('success', 'Projeto criado com sucesso.');
    }

    public function edit(Project $project): Response
    {
        $project->load('technologies');

        return Inertia::render('Admin/Projects/Form', [
            'project' => [
                ...$project->toArray(),
                'technology_ids' => $project->technologies->pluck('id')->values(),
            ],
            'technologies' => $this->technologyOptions(),
        ]);
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $attributes = $this->validatedAttributes($request, $project);
        $attributes['slug'] = $this->uniqueSlug($attributes['slug'] ?: $attributes['title'], $project);
        $attributes = $this->withImageUpload($request, $attributes, $project);

        $project->update(Arr::except($attributes, ['technology_ids', 'image']));
        $this->syncTechnologies($project, $attributes['technology_ids'] ?? []);

        return redirect()->route('admin.projects.index')->with('success', 'Projeto atualizado com sucesso.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        if ($project->image_path) {
            Storage::disk('public')->delete($project->image_path);
        }

        $project->delete();

        return redirect()->route('admin.projects.index')->with('success', 'Projeto removido.');
    }

    private function validatedAttributes(Request $request, ?Project $project = null): array
    {
        $projectId = $project?->id;

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:160'],
            'slug' => ['nullable', 'string', 'max:180', Rule::unique('projects', 'slug')->ignore($projectId)],
            'short_description' => ['nullable', 'string', 'max:360'],
            'description' => ['required', 'string'],
            'image_url' => ['nullable', 'url', 'max:2048'],
            'image' => ['nullable', 'image', 'max:4096'],
            'project_url' => ['nullable', 'url', 'max:2048'],
            'github_url' => ['nullable', 'url', 'max:2048'],
            'technology_ids' => ['array'],
            'technology_ids.*' => ['integer', 'exists:technologies,id'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
            'is_featured' => ['boolean'],
        ]);

        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);
        $validated['is_published'] = $request->boolean('is_published');
        $validated['is_featured'] = $request->boolean('is_featured');

        return $validated;
    }

    private function withImageUpload(Request $request, array $attributes, ?Project $project = null): array
    {
        if ($request->hasFile('image')) {
            if ($project?->image_path) {
                Storage::disk('public')->delete($project->image_path);
            }

            $attributes['image_path'] = $request->file('image')->store('projects', 'public');
        }

        return $attributes;
    }

    private function uniqueSlug(string $source, ?Project $project = null): string
    {
        $base = Str::slug($source) ?: Str::random(8);
        $slug = $base;
        $counter = 2;

        while (Project::query()
            ->where('slug', $slug)
            ->when($project, fn ($query) => $query->whereKeyNot($project->id))
            ->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    private function technologyOptions()
    {
        return Technology::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'color', 'icon_url', 'icon_path']);
    }

    private function syncTechnologies(Project $project, array $technologyIds): void
    {
        $sync = [];

        foreach (array_values($technologyIds) as $index => $technologyId) {
            $sync[$technologyId] = ['sort_order' => $index + 1];
        }

        $project->technologies()->sync($sync);
    }
}
