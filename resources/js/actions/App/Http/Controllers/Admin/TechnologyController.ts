import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TechnologyController::index
 * @see app/Http/Controllers/Admin/TechnologyController.php:17
 * @route '/admin/tecnologias'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/tecnologias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TechnologyController::index
 * @see app/Http/Controllers/Admin/TechnologyController.php:17
 * @route '/admin/tecnologias'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TechnologyController::index
 * @see app/Http/Controllers/Admin/TechnologyController.php:17
 * @route '/admin/tecnologias'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TechnologyController::index
 * @see app/Http/Controllers/Admin/TechnologyController.php:17
 * @route '/admin/tecnologias'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TechnologyController::index
 * @see app/Http/Controllers/Admin/TechnologyController.php:17
 * @route '/admin/tecnologias'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TechnologyController::index
 * @see app/Http/Controllers/Admin/TechnologyController.php:17
 * @route '/admin/tecnologias'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TechnologyController::index
 * @see app/Http/Controllers/Admin/TechnologyController.php:17
 * @route '/admin/tecnologias'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\TechnologyController::create
 * @see app/Http/Controllers/Admin/TechnologyController.php:29
 * @route '/admin/tecnologias/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/tecnologias/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TechnologyController::create
 * @see app/Http/Controllers/Admin/TechnologyController.php:29
 * @route '/admin/tecnologias/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TechnologyController::create
 * @see app/Http/Controllers/Admin/TechnologyController.php:29
 * @route '/admin/tecnologias/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TechnologyController::create
 * @see app/Http/Controllers/Admin/TechnologyController.php:29
 * @route '/admin/tecnologias/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TechnologyController::create
 * @see app/Http/Controllers/Admin/TechnologyController.php:29
 * @route '/admin/tecnologias/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TechnologyController::create
 * @see app/Http/Controllers/Admin/TechnologyController.php:29
 * @route '/admin/tecnologias/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TechnologyController::create
 * @see app/Http/Controllers/Admin/TechnologyController.php:29
 * @route '/admin/tecnologias/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\TechnologyController::store
 * @see app/Http/Controllers/Admin/TechnologyController.php:36
 * @route '/admin/tecnologias'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/tecnologias',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TechnologyController::store
 * @see app/Http/Controllers/Admin/TechnologyController.php:36
 * @route '/admin/tecnologias'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TechnologyController::store
 * @see app/Http/Controllers/Admin/TechnologyController.php:36
 * @route '/admin/tecnologias'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TechnologyController::store
 * @see app/Http/Controllers/Admin/TechnologyController.php:36
 * @route '/admin/tecnologias'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TechnologyController::store
 * @see app/Http/Controllers/Admin/TechnologyController.php:36
 * @route '/admin/tecnologias'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\TechnologyController::edit
 * @see app/Http/Controllers/Admin/TechnologyController.php:47
 * @route '/admin/tecnologias/{technology}/edit'
 */
export const edit = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/tecnologias/{technology}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TechnologyController::edit
 * @see app/Http/Controllers/Admin/TechnologyController.php:47
 * @route '/admin/tecnologias/{technology}/edit'
 */
edit.url = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { technology: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { technology: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    technology: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        technology: typeof args.technology === 'object'
                ? args.technology.id
                : args.technology,
                }

    return edit.definition.url
            .replace('{technology}', parsedArgs.technology.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TechnologyController::edit
 * @see app/Http/Controllers/Admin/TechnologyController.php:47
 * @route '/admin/tecnologias/{technology}/edit'
 */
edit.get = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TechnologyController::edit
 * @see app/Http/Controllers/Admin/TechnologyController.php:47
 * @route '/admin/tecnologias/{technology}/edit'
 */
edit.head = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TechnologyController::edit
 * @see app/Http/Controllers/Admin/TechnologyController.php:47
 * @route '/admin/tecnologias/{technology}/edit'
 */
    const editForm = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TechnologyController::edit
 * @see app/Http/Controllers/Admin/TechnologyController.php:47
 * @route '/admin/tecnologias/{technology}/edit'
 */
        editForm.get = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TechnologyController::edit
 * @see app/Http/Controllers/Admin/TechnologyController.php:47
 * @route '/admin/tecnologias/{technology}/edit'
 */
        editForm.head = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\TechnologyController::update
 * @see app/Http/Controllers/Admin/TechnologyController.php:54
 * @route '/admin/tecnologias/{technology}'
 */
export const update = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/tecnologias/{technology}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\TechnologyController::update
 * @see app/Http/Controllers/Admin/TechnologyController.php:54
 * @route '/admin/tecnologias/{technology}'
 */
update.url = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { technology: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { technology: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    technology: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        technology: typeof args.technology === 'object'
                ? args.technology.id
                : args.technology,
                }

    return update.definition.url
            .replace('{technology}', parsedArgs.technology.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TechnologyController::update
 * @see app/Http/Controllers/Admin/TechnologyController.php:54
 * @route '/admin/tecnologias/{technology}'
 */
update.put = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\TechnologyController::update
 * @see app/Http/Controllers/Admin/TechnologyController.php:54
 * @route '/admin/tecnologias/{technology}'
 */
update.patch = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\TechnologyController::update
 * @see app/Http/Controllers/Admin/TechnologyController.php:54
 * @route '/admin/tecnologias/{technology}'
 */
    const updateForm = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TechnologyController::update
 * @see app/Http/Controllers/Admin/TechnologyController.php:54
 * @route '/admin/tecnologias/{technology}'
 */
        updateForm.put = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\TechnologyController::update
 * @see app/Http/Controllers/Admin/TechnologyController.php:54
 * @route '/admin/tecnologias/{technology}'
 */
        updateForm.patch = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\TechnologyController::destroy
 * @see app/Http/Controllers/Admin/TechnologyController.php:65
 * @route '/admin/tecnologias/{technology}'
 */
export const destroy = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/tecnologias/{technology}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\TechnologyController::destroy
 * @see app/Http/Controllers/Admin/TechnologyController.php:65
 * @route '/admin/tecnologias/{technology}'
 */
destroy.url = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { technology: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { technology: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    technology: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        technology: typeof args.technology === 'object'
                ? args.technology.id
                : args.technology,
                }

    return destroy.definition.url
            .replace('{technology}', parsedArgs.technology.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TechnologyController::destroy
 * @see app/Http/Controllers/Admin/TechnologyController.php:65
 * @route '/admin/tecnologias/{technology}'
 */
destroy.delete = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\TechnologyController::destroy
 * @see app/Http/Controllers/Admin/TechnologyController.php:65
 * @route '/admin/tecnologias/{technology}'
 */
    const destroyForm = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TechnologyController::destroy
 * @see app/Http/Controllers/Admin/TechnologyController.php:65
 * @route '/admin/tecnologias/{technology}'
 */
        destroyForm.delete = (args: { technology: number | { id: number } } | [technology: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const TechnologyController = { index, create, store, edit, update, destroy }

export default TechnologyController