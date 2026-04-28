<?php

use App\Models\Project;
use App\Models\SocialLink;
use App\Models\Technology;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

function adminUser(): User
{
    return User::query()->firstOrFail();
}

it('creates, updates, and deletes a project with an uploaded image', function () {
    $this->seed();
    Storage::fake('public');

    $technology = Technology::query()->firstOrFail();

    $this->actingAs(adminUser())
        ->post('/admin/projetos', [
            'title' => 'Projeto Teste',
            'slug' => '',
            'short_description' => 'Projeto criado pelo teste.',
            'description' => 'Descrição completa do projeto criado pelo teste.',
            'image' => UploadedFile::fake()->image('cover.jpg'),
            'project_url' => 'https://example.com/projeto',
            'github_url' => 'https://github.com/example/projeto',
            'technology_ids' => [$technology->id],
            'sort_order' => 99,
            'is_published' => true,
            'is_featured' => false,
        ])
        ->assertRedirect('/admin/projetos');

    $project = Project::query()->where('slug', 'projeto-teste')->firstOrFail();
    Storage::disk('public')->assertExists($project->image_path);
    expect($project->technologies)->toHaveCount(1);

    $this->actingAs(adminUser())
        ->post("/admin/projetos/{$project->id}", [
            '_method' => 'put',
            'title' => 'Projeto Teste Atualizado',
            'slug' => 'projeto-teste-atualizado',
            'short_description' => 'Resumo atualizado.',
            'description' => 'Descrição atualizada.',
            'project_url' => 'https://example.com/novo',
            'github_url' => 'https://github.com/example/novo',
            'technology_ids' => [],
            'sort_order' => 4,
            'is_published' => false,
            'is_featured' => true,
        ])
        ->assertRedirect('/admin/projetos');

    $this->assertDatabaseHas('projects', [
        'id' => $project->id,
        'title' => 'Projeto Teste Atualizado',
        'slug' => 'projeto-teste-atualizado',
        'is_published' => false,
        'is_featured' => true,
    ]);

    $this->actingAs(adminUser())
        ->delete("/admin/projetos/{$project->id}")
        ->assertRedirect('/admin/projetos');

    $this->assertDatabaseMissing('projects', ['id' => $project->id]);
});

it('creates, updates, and deletes a technology with an uploaded icon', function () {
    $this->seed();
    Storage::fake('public');

    $this->actingAs(adminUser())
        ->post('/admin/tecnologias', [
            'name' => 'Alpine',
            'slug' => '',
            'color' => '#77c1d2',
            'icon' => UploadedFile::fake()->image('icon.png'),
            'url' => 'https://alpinejs.dev',
            'sort_order' => 30,
            'is_featured' => true,
        ])
        ->assertRedirect('/admin/tecnologias');

    $technology = Technology::query()->where('slug', 'alpine')->firstOrFail();
    Storage::disk('public')->assertExists($technology->icon_path);

    $this->actingAs(adminUser())
        ->post("/admin/tecnologias/{$technology->id}", [
            '_method' => 'put',
            'name' => 'Alpine.js',
            'slug' => 'alpine-js',
            'color' => '#88ddee',
            'url' => 'https://alpinejs.dev',
            'sort_order' => 31,
            'is_featured' => false,
        ])
        ->assertRedirect('/admin/tecnologias');

    $this->assertDatabaseHas('technologies', [
        'id' => $technology->id,
        'name' => 'Alpine.js',
        'slug' => 'alpine-js',
        'is_featured' => false,
    ]);

    $this->actingAs(adminUser())
        ->delete("/admin/tecnologias/{$technology->id}")
        ->assertRedirect('/admin/tecnologias');

    $this->assertDatabaseMissing('technologies', ['id' => $technology->id]);
});

it('updates the profile and manages social links', function () {
    $this->seed();
    Storage::fake('public');

    $this->actingAs(adminUser())
        ->post('/admin/perfil', [
            '_method' => 'put',
            'name' => 'Joao Admin',
            'role' => 'Full Stack Developer',
            'headline' => 'Headline atualizada',
            'intro' => 'Intro atualizada',
            'bio' => 'Bio atualizada',
            'about_points' => "Primeiro ponto\nSegundo ponto",
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
            'email' => 'joao@example.com',
            'location' => 'Brasil',
        ])
        ->assertRedirect('/admin/perfil');

    $this->assertDatabaseHas('profiles', [
        'id' => 1,
        'name' => 'Joao Admin',
        'email' => 'joao@example.com',
    ]);

    $this->actingAs(adminUser())
        ->post('/admin/links', [
            'label' => 'Site',
            'url' => 'https://example.com',
            'icon' => 'ExternalLink',
            'sort_order' => 10,
            'is_published' => true,
        ])
        ->assertRedirect('/admin/links');

    $link = SocialLink::query()->where('label', 'Site')->firstOrFail();

    $this->actingAs(adminUser())
        ->post("/admin/links/{$link->id}", [
            '_method' => 'put',
            'label' => 'Site pessoal',
            'url' => 'https://example.com/me',
            'icon' => 'ExternalLink',
            'sort_order' => 11,
            'is_published' => false,
        ])
        ->assertRedirect('/admin/links');

    $this->assertDatabaseHas('social_links', [
        'id' => $link->id,
        'label' => 'Site pessoal',
        'is_published' => false,
    ]);

    $this->actingAs(adminUser())
        ->delete("/admin/links/{$link->id}")
        ->assertRedirect('/admin/links');

    $this->assertDatabaseMissing('social_links', ['id' => $link->id]);
});
