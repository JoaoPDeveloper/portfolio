<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\SocialLinkController;
use App\Http\Controllers\Admin\TechnologyController;
use App\Http\Controllers\PublicPortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicPortfolioController::class, 'index'])->name('home');
Route::get('/projetos/{project:slug}', [PublicPortfolioController::class, 'show'])->name('projects.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin', DashboardController::class)->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('projetos', ProjectController::class)
            ->names('projects')
            ->parameters(['projetos' => 'project'])
            ->except('show');

        Route::resource('tecnologias', TechnologyController::class)
            ->names('technologies')
            ->parameters(['tecnologias' => 'technology'])
            ->except('show');

        Route::get('perfil', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('perfil', [ProfileController::class, 'update'])->name('profile.update');

        Route::resource('links', SocialLinkController::class)
            ->names('social-links')
            ->parameters(['links' => 'socialLink'])
            ->except('show');
    });
});

Route::get('/register', fn () => redirect()->route('login'))->name('register');
Route::post('/register', fn () => abort(404))->name('register.store');

require __DIR__.'/settings.php';

Route::fallback(fn () => abort(404));
