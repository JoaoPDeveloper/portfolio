<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\Project;
use App\Models\SocialLink;
use App\Models\Technology;
use Inertia\Inertia;
use Inertia\Response;

class PublicPortfolioController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/Portfolio', [
            'profile' => $this->profilePayload(),
            'projects' => Project::query()
                ->with('technologies')
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->orderBy('title')
                ->get()
                ->map(fn (Project $project) => $this->projectPayload($project)),
            'technologies' => Technology::query()
                ->where('is_featured', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (Technology $technology) => $this->technologyPayload($technology)),
            'socialLinks' => SocialLink::query()
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    public function show(Project $project): Response
    {
        abort_unless($project->is_published, 404);

        $project->load('technologies');

        return Inertia::render('Public/ProjectShow', [
            'profile' => $this->profilePayload(),
            'project' => $this->projectPayload($project),
            'otherProjects' => Project::query()
                ->where('is_published', true)
                ->whereKeyNot($project->getKey())
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->limit(3)
                ->get()
                ->map(fn (Project $project) => $this->projectPayload($project)),
            'socialLinks' => SocialLink::query()
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    private function profilePayload(): array
    {
        $profile = Profile::query()->first();

        if (! $profile) {
            return [
                'name' => 'Joao Pedro Lima Pereira',
                'role' => 'Full Stack Developer',
                'headline' => 'Construo produtos web com backend sólido e interfaces prontas para produção.',
                'intro' => 'Laravel, Vue, JavaScript e interfaces bem acabadas.',
                'bio' => '',
                'about_points' => [],
                'resolved_avatar_url' => '/assets/imgs/95835981.png',
                'email' => 'joao_entreprise@hotmail.com',
                'location' => 'Brasil',
                'resume_url' => null,
            ];
        }

        return $profile->only([
            'name',
            'role',
            'headline',
            'intro',
            'bio',
            'about_points',
            'resolved_avatar_url',
            'email',
            'location',
            'resume_url',
        ]);
    }

    private function projectPayload(Project $project): array
    {
        return [
            'id' => $project->id,
            'title' => $project->title,
            'slug' => $project->slug,
            'short_description' => $project->short_description,
            'description' => $project->description,
            'resolved_image_url' => $project->resolved_image_url,
            'project_url' => $project->project_url,
            'github_url' => $project->github_url,
            'is_featured' => $project->is_featured,
            'technologies' => $project->technologies->map(fn (Technology $technology) => $this->technologyPayload($technology)),
        ];
    }

    private function technologyPayload(Technology $technology): array
    {
        return [
            'id' => $technology->id,
            'name' => $technology->name,
            'slug' => $technology->slug,
            'color' => $technology->color,
            'url' => $technology->url,
            'resolved_icon_url' => $technology->resolved_icon_url,
        ];
    }
}
