<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Profile/Edit', [
            'profile' => Profile::query()->first(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $profile = Profile::query()->firstOrNew(['id' => 1]);

        $attributes = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'role' => ['required', 'string', 'max:160'],
            'headline' => ['required', 'string', 'max:220'],
            'intro' => ['required', 'string'],
            'bio' => ['nullable', 'string'],
            'about_points' => ['nullable'],
            'avatar_url' => ['nullable', 'url', 'max:2048'],
            'avatar' => ['nullable', 'image', 'max:4096'],
            'email' => ['nullable', 'email', 'max:180'],
            'location' => ['nullable', 'string', 'max:120'],
            'resume_url' => ['nullable', 'url', 'max:2048'],
        ]);

        $attributes['about_points'] = $this->normalizePoints($request->input('about_points'));

        if ($request->hasFile('avatar')) {
            if ($profile->avatar_path) {
                Storage::disk('public')->delete($profile->avatar_path);
            }

            $attributes['avatar_path'] = $request->file('avatar')->store('profile', 'public');
        }

        unset($attributes['avatar']);

        $profile->fill($attributes)->save();

        return redirect()->route('admin.profile.edit')->with('success', 'Perfil atualizado com sucesso.');
    }

    private function normalizePoints(mixed $points): array
    {
        if (is_array($points)) {
            return array_values(array_filter(array_map('trim', $points)));
        }

        if (! is_string($points)) {
            return [];
        }

        return array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $points))));
    }
}
