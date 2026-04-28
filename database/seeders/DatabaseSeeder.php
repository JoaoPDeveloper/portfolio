<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\Project;
use App\Models\SocialLink;
use App\Models\Technology;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@joaopdeveloper.dev')],
            [
                'name' => env('ADMIN_NAME', 'Joao Pedro Lima'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
                'email_verified_at' => now(),
            ],
        );

        Profile::query()->updateOrCreate(
            ['id' => 1],
            [
                'name' => 'Joao Pedro Lima Pereira',
                'role' => 'Full Stack Developer',
                'headline' => 'Construo produtos web com backend sólido e interfaces que parecem prontas para produção.',
                'intro' => 'Sou desenvolvedor fullstack em evolução constante, com foco em Laravel, Vue, JavaScript e experiências digitais bem acabadas.',
                'bio' => 'Estou em transição de suporte para desenvolvimento fullstack e curso Análise e Desenvolvimento de Sistemas na Estácio. Gosto de transformar ideias em sistemas úteis, organizados e fáceis de manter.',
                'about_points' => [
                    'Experiência em suporte técnico, atendimento e resolução de problemas reais.',
                    'Foco atual em Laravel, Vue, PHP, JavaScript, SQL e integrações com APIs.',
                    'Aberto a projetos, freelas e oportunidades para construir soluções com impacto.',
                ],
                'avatar_url' => '/assets/imgs/95835981.png',
                'email' => 'joao_entreprise@hotmail.com',
                'location' => 'Brasil',
                'resume_url' => null,
            ],
        );

        $technologies = collect([
            ['JavaScript', 'javascript', '#F7DF1E', 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png', 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript'],
            ['Vue', 'vue', '#42B883', 'https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg', 'https://vuejs.org/'],
            ['React', 'react', '#61DAFB', 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg', 'https://react.dev/'],
            ['PHP', 'php', '#777BB4', 'https://www.php.net/images/logos/new-php-logo.svg', 'https://www.php.net/'],
            ['Laravel', 'laravel', '#FF2D20', 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Laravel.svg', 'https://laravel.com/'],
            ['SQL', 'sql', '#2F6DB5', 'https://upload.wikimedia.org/wikipedia/en/6/68/Oracle_SQL_Developer_logo.svg', 'https://www.oracle.com/br/database/technologies/appdev/sql.html'],
            ['Angular', 'angular', '#DD0031', 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg', 'https://angular.io/'],
            ['TypeScript', 'typescript', '#3178C6', 'https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg', 'https://www.typescriptlang.org/'],
            ['Bootstrap', 'bootstrap', '#7952B3', 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg', 'https://getbootstrap.com/'],
            ['HTML5', 'html', '#E34F26', 'https://www.vectorlogo.zone/logos/w3_html5/w3_html5-icon.svg', 'https://developer.mozilla.org/pt-BR/docs/Web/HTML'],
            ['CSS3', 'css', '#1572B6', 'https://www.vectorlogo.zone/logos/w3_css/w3_css-icon.svg', 'https://developer.mozilla.org/pt-BR/docs/Web/CSS'],
            ['Firebase', 'firebase', '#FFCA28', 'https://www.svgrepo.com/show/353735/firebase.svg', 'https://firebase.google.com/?hl=pt'],
            ['AWS', 'aws', '#FF9900', 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', 'https://aws.amazon.com/pt/'],
            ['Git', 'git', '#F05032', 'https://git-scm.com/images/logos/downloads/Git-Logo-2Color.svg', 'https://git-scm.com/'],
            ['Tailwind', 'tailwind', '#38BDF8', 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg', 'https://tailwindcss.com/'],
            ['Java', 'java', '#007396', 'https://www.svgrepo.com/show/184143/java.svg', 'https://www.java.com/pt-BR/'],
        ])->mapWithKeys(function (array $technology, int $index) {
            [$name, $slug, $color, $iconUrl, $url] = $technology;

            $model = Technology::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'color' => $color,
                    'icon_url' => $iconUrl,
                    'url' => $url,
                    'sort_order' => $index + 1,
                    'is_featured' => true,
                ],
            );

            return [$slug => $model];
        });

        $projects = [
            [
                'title' => 'Get Temperature',
                'slug' => 'get-temperature',
                'short_description' => 'Dashboard para acompanhar dados de temperatura de um sensor via API.',
                'description' => 'Projeto para consultar a temperatura disponibilizada por uma API do ThingSpeak conectada a um sensor. A interface permite visualizar leituras recentes e histórico, ajudando o usuário a acompanhar os dados do equipamento com mais clareza.',
                'image_url' => 'https://i.ibb.co/Dw6sHrd/Captura-de-tela-2024-08-20-101507.png',
                'project_url' => 'https://temperature.jsbdistribuidora.com.br/',
                'github_url' => 'https://github.com/JoaoPDeveloper/temperature-api',
                'is_featured' => true,
                'technologies' => ['php', 'javascript', 'css', 'html'],
            ],
            [
                'title' => 'My Daily Agenda',
                'slug' => 'my-daily-agenda',
                'short_description' => 'Agenda web para organizar eventos, projetos e notificações.',
                'description' => 'Aplicação para parametrização de projetos e eventos com nome, e-mails, descrição, telefone opcional e período de execução. Os dados ficam salvos localmente com LocalStorage e a experiência foi pensada para uso rápido no navegador.',
                'image_url' => 'https://i.ibb.co/FDnqF4B/Screenshot-2023-06-21-171354.png',
                'project_url' => 'https://daily-agenda-joaopdeveloper.vercel.app/',
                'github_url' => 'https://github.com/JoaoPDeveloper/my-daily-agenda',
                'is_featured' => true,
                'technologies' => ['javascript', 'bootstrap', 'html', 'css'],
            ],
            [
                'title' => 'BuzzFeed Quiz',
                'slug' => 'buzzfeed-quiz',
                'short_description' => 'Clone de quiz inspirado no BuzzFeed, feito com Angular e TypeScript.',
                'description' => 'Projeto de quiz com perguntas dinâmicas e resultado final para o usuário. O principal desafio foi estruturar rotas, estados e resultado do questionário em uma experiência responsiva para desktop e mobile.',
                'image_url' => 'https://i.ibb.co/9N36zk6/buzzfeed.png',
                'project_url' => 'https://joaopdeveloper-buzzquizz.vercel.app/',
                'github_url' => 'https://github.com/JoaoPDeveloper/buzz-quiz-angular',
                'is_featured' => true,
                'technologies' => ['typescript', 'angular', 'html', 'css'],
            ],
            [
                'title' => 'Mundo Invertido',
                'slug' => 'mundo-invertido',
                'short_description' => 'Landing page interativa inspirada em Stranger Things.',
                'description' => 'Projeto criado em comemoração à quarta temporada de Stranger Things. A página alterna a experiência visual de acordo com a escolha do usuário e inclui formulário integrado ao Firebase.',
                'image_url' => 'https://i.ibb.co/dPn3jKR/inverted-world.png',
                'project_url' => 'https://inverted-world-z4rk01.netlify.app/',
                'github_url' => 'https://github.com/JoaoPDeveloper/mundo-invertido',
                'is_featured' => false,
                'technologies' => ['javascript', 'html', 'css', 'firebase'],
            ],
            [
                'title' => 'Pokedex',
                'slug' => 'pokedex',
                'short_description' => 'Consulta de Pokémon com dados vindos de API pública.',
                'description' => 'Aplicação que consome uma API pública para listar Pokémon e exibir detalhes em modal. A interface usa cores associadas aos elementos de cada Pokémon e foi construída com JavaScript, HTML e CSS.',
                'image_url' => 'https://i.ibb.co/g7wkCx7/pokedex.png',
                'project_url' => 'https://pokedex-joaopdeveloper.netlify.app/',
                'github_url' => 'https://github.com/JoaoPDeveloper/pokedex-lab',
                'is_featured' => false,
                'technologies' => ['javascript', 'html', 'css'],
            ],
            [
                'title' => 'Game Mario',
                'slug' => 'game-mario',
                'short_description' => 'Jogo simples do Mario com interação, som e reinício.',
                'description' => 'Game no navegador com música, colisão e botão para reiniciar a sessão. Foi construído como exercício prático de animações, eventos e manipulação de DOM com JavaScript.',
                'image_url' => 'https://i.ibb.co/71PzqFw/Mario.png',
                'project_url' => 'https://joaopdeveloper-mario-game.vercel.app/',
                'github_url' => 'https://github.com/JoaoPDeveloper/javascript-mario-game',
                'is_featured' => false,
                'technologies' => ['javascript', 'html', 'css'],
            ],
            [
                'title' => 'Simulador Financeiro',
                'slug' => 'simulador-financeiro',
                'short_description' => 'Simulador de financiamento com entrada, juros, prazo e carência.',
                'description' => 'Projeto que calcula informações financeiras a partir de valor, entrada, juros e prazo. A aplicação também permite configurar carência e quantidade de meses para início do pagamento.',
                'image_url' => 'https://i.ibb.co/tMDKDBD/Simulador.png',
                'project_url' => 'https://simulador-financeamento.vercel.app/',
                'github_url' => 'https://github.com/JoaoPDeveloper/simulador-financeamento',
                'is_featured' => false,
                'technologies' => ['javascript', 'html', 'css'],
            ],
        ];

        foreach ($projects as $index => $projectData) {
            $technologySlugs = $projectData['technologies'];
            unset($projectData['technologies']);

            $project = Project::query()->updateOrCreate(
                ['slug' => $projectData['slug']],
                [
                    ...$projectData,
                    'is_published' => true,
                    'sort_order' => $index + 1,
                ],
            );

            $sync = [];

            foreach ($technologySlugs as $technologyIndex => $slug) {
                $sync[$technologies[$slug]->id] = ['sort_order' => $technologyIndex + 1];
            }

            $project->technologies()->sync($sync);
        }

        foreach ([
            ['GitHub', 'https://github.com/JoaoPDeveloper', 'Github', 1],
            ['LinkedIn', 'https://www.linkedin.com/in/joao-dev-starter/', 'Linkedin', 2],
            ['Email', 'mailto:joao_entreprise@hotmail.com', 'Mail', 3],
            ['Ko-fi', 'https://ko-fi.com/joaopdeveloper', 'Coffee', 4],
        ] as [$label, $url, $icon, $order]) {
            SocialLink::query()->updateOrCreate(
                ['label' => $label],
                [
                    'url' => $url,
                    'icon' => $icon,
                    'sort_order' => $order,
                    'is_published' => true,
                ],
            );
        }
    }
}
