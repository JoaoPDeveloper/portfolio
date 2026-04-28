<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'headline',
        'intro',
        'bio',
        'about_points',
        'avatar_path',
        'avatar_url',
        'email',
        'location',
        'resume_url',
    ];

    protected $casts = [
        'about_points' => 'array',
    ];

    protected $appends = [
        'resolved_avatar_url',
    ];

    public function getResolvedAvatarUrlAttribute(): ?string
    {
        if ($this->avatar_path) {
            return Storage::disk('public')->url($this->avatar_path);
        }

        return $this->avatar_url;
    }
}
