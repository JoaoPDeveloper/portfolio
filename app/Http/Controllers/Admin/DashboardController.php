<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\SocialLink;
use App\Models\Technology;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'projects' => Project::query()->count(),
                'publishedProjects' => Project::query()->where('is_published', true)->count(),
                'technologies' => Technology::query()->count(),
                'socialLinks' => SocialLink::query()->where('is_published', true)->count(),
            ],
            'recentProjects' => Project::query()
                ->with('technologies')
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
