<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('renders the public portfolio with seeded content', function () {
    $this->seed();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Portfolio')
            ->has('projects', 7)
            ->has('technologies')
            ->where('profile.name', 'Joao Pedro Lima Pereira'));
});

it('renders a published project detail page by slug', function () {
    $this->seed();

    $project = Project::query()->where('slug', 'get-temperature')->firstOrFail();

    $this->get(route('projects.show', $project))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/ProjectShow')
            ->where('project.slug', 'get-temperature')
            ->has('project.technologies'));
});

it('redirects guests away from the admin panel', function () {
    $this->get('/admin')->assertRedirect('/login');
});

it('allows the seeded admin to access the dashboard', function () {
    $this->seed();

    $this->actingAs(User::query()->first())
        ->get('/admin')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard')
            ->where('stats.projects', 7));
});
