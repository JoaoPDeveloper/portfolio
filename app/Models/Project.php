<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'image_path',
        'image_url',
        'project_url',
        'github_url',
        'is_published',
        'is_featured',
        'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = [
        'resolved_image_url',
    ];

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class)
            ->withPivot('sort_order')
            ->orderByPivot('sort_order');
    }

    public function getResolvedImageUrlAttribute(): ?string
    {
        if ($this->image_path) {
            return Storage::disk('public')->url($this->image_path);
        }

        return $this->image_url;
    }
}
