<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class Technology extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'color',
        'icon_path',
        'icon_url',
        'url',
        'sort_order',
        'is_featured',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = [
        'resolved_icon_url',
    ];

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class)
            ->withPivot('sort_order')
            ->orderByPivot('sort_order');
    }

    public function getResolvedIconUrlAttribute(): ?string
    {
        if ($this->icon_path) {
            return Storage::disk('public')->url($this->icon_path);
        }

        return $this->icon_url;
    }
}
