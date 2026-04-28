<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SocialLink;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SocialLinkController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/SocialLinks/Index', [
            'links' => SocialLink::query()
                ->orderBy('sort_order')
                ->orderBy('label')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/SocialLinks/Form', [
            'link' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        SocialLink::query()->create($this->validatedAttributes($request));

        return redirect()->route('admin.social-links.index')->with('success', 'Link criado com sucesso.');
    }

    public function edit(SocialLink $socialLink): Response
    {
        return Inertia::render('Admin/SocialLinks/Form', [
            'link' => $socialLink,
        ]);
    }

    public function update(Request $request, SocialLink $socialLink): RedirectResponse
    {
        $socialLink->update($this->validatedAttributes($request));

        return redirect()->route('admin.social-links.index')->with('success', 'Link atualizado com sucesso.');
    }

    public function destroy(SocialLink $socialLink): RedirectResponse
    {
        $socialLink->delete();

        return redirect()->route('admin.social-links.index')->with('success', 'Link removido.');
    }

    private function validatedAttributes(Request $request): array
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:120'],
            'url' => ['required', 'string', 'max:2048'],
            'icon' => ['nullable', 'string', 'max:80'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
        ]);

        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);
        $validated['is_published'] = $request->boolean('is_published');

        return $validated;
    }
}
