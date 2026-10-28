export type Locale = 'pt' | 'en';

export type TranslationTable = Record<string, Partial<Record<Locale, string>>>;

export const translations: TranslationTable = {
  // Nav
  'nav.projects': { pt: 'Projetos', en: 'Projects' },
  'nav.stack': { pt: 'Stack', en: 'Stack' },
  'nav.contact': { pt: 'Contato', en: 'Contact' },

  // Hero
  'hero.viewProjects': { pt: 'Ver projetos', en: 'View projects' },
  'hero.chat': { pt: 'Conversar', en: 'Get in touch' },
  'hero.available': { pt: 'Disponível para novos projetos', en: 'Available for new projects' },

  // About
  'about.label': { pt: 'Sobre', en: 'About' },
  'about.title': { pt: 'Sobre mim.', en: 'About me.' },

  // Projects
  'projects.label': { pt: 'Projetos', en: 'Projects' },
  'projects.title': { pt: 'Trabalho selecionado.', en: 'Selected work.' },
  'projects.description': { pt: 'Projetos publicados com tecnologias, links e imagens.', en: 'Published projects with technologies, links and images.' },

  // Stack
  'stack.label': { pt: 'Tech stack', en: 'Tech stack' },
  'stack.title': { pt: 'Ferramentas que uso para construir.', en: 'Tools I use to build.' },
  'stack.description': { pt: 'Stack atual.', en: 'Current stack.' },

  // Footer
  'footer.subtitle': { pt: 'Vamos construir algo com boa base e boa cara.', en: "Let's build something with a solid foundation and great design." },
  'footer.title': { pt: 'Entre em contato.', en: 'Get in touch.' },

  // Experience
  'experience.label': { pt: 'Trajetória', en: 'Experience' },
  'experience.title': { pt: 'Trajetória profissional.', en: 'Professional journey.' },
  'experience.present': { pt: 'atual', en: 'present' },

  // Cases
  'cases.label': { pt: 'Cases', en: 'Cases' },
  'cases.title': { pt: 'Cases de sucesso.', en: 'Success cases.' },
  'cases.description': { pt: 'Problemas reais, abordagem e resultado.', en: 'Real problems, approach and result.' },
  'cases.problem': { pt: 'Problema', en: 'Problem' },
  'cases.approach': { pt: 'Abordagem', en: 'Approach' },
  'cases.result': { pt: 'Resultado', en: 'Result' },
  'cases.empty': { pt: 'Um case de sucesso foi quando eu consegui concluir uma implantação e finalização de um projeto em tempo recorde, era um projeto voltado para a utilização em Camaras no estado do maranhão e piaui, onde ele puxava os dados para o cliente e os transformava em uma planilha de forma resumida e prática .'
    , en: 'A success story involved successfully completing the implementation and finalization of a project in record time; the project was designed for use by Chambers of Commerce in the states of Maranhão and Piauí, retrieving data for the client and transforming it into a concise, practical spreadsheet.' },

  // Testimonials
  'testimonials.label': { pt: 'Depoimentos', en: 'Testimonials' },
  'testimonials.title': { pt: 'O que dizem sobre mim.', en: 'What people say.' },
  'testimonials.empty': { pt: 'Depoimentos em breve.', en: 'Testimonials coming soon.' },

  // Contact
  'contact.open': { pt: 'Aberto para vagas nacionais e internacionais.', en: 'Open to national and international opportunities.' },
  'contact.whatsapp': { pt: 'WhatsApp', en: 'WhatsApp' },

  // Project detail
  'project.label': { pt: 'Projeto', en: 'Project' },
  'project.back': { pt: 'Voltar', en: 'Back' },
  'project.contact': { pt: 'Contato', en: 'Contact' },
  'project.open': { pt: 'Abrir projeto', en: 'Open project' },
  'project.repo': { pt: 'Repositório', en: 'Repository' },
  'project.context': { pt: 'Contexto', en: 'Context' },
  'project.others': { pt: 'Outros projetos', en: 'Other projects' },

  // Back to top
  'backToTop.label': { pt: 'Voltar ao topo', en: 'Back to top' },

  // Search
  'search.placeholder': { pt: 'Buscar projetos, tecnologias, experiência...', en: 'Search projects, technologies, experience...' },
  'search.empty': { pt: 'Nenhum resultado encontrado', en: 'No results found' },
  'search.trigger': { pt: 'Buscar', en: 'Search' },
  'search.dialogLabel': { pt: 'Buscar no portfólio', en: 'Search portfolio' },
  'search.inputLabel': { pt: 'Termo de busca', en: 'Search query' },
  'search.closeLabel': { pt: 'Fechar busca', en: 'Close search' },
  'search.group.project': { pt: 'Projetos', en: 'Projects' },
  'search.group.technology': { pt: 'Tecnologias', en: 'Technologies' },
  'search.group.experience': { pt: 'Experiência', en: 'Experience' },
  'search.group.case': { pt: 'Cases', en: 'Cases' },
  'search.announce.one': { pt: '{count} resultado encontrado', en: '{count} result found' },
  'search.announce.other': { pt: '{count} resultado(s) encontrado(s)', en: '{count} result(s) found' },
};

/** Locale text if non-empty, else English text if non-empty, else the key itself. */
export function resolveTranslation(table: TranslationTable, key: string, locale: Locale): string {
  const entry = table[key];
  const localized = entry?.[locale];
  if (typeof localized === 'string' && localized !== '') return localized;
  const english = entry?.en;
  if (typeof english === 'string' && english !== '') return english;
  return key;
}

/** Replaces every {name} token using the given params; unknown tokens are left untouched. */
export function interpolate(template: string, params: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (token, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : token,
  );
}

/** Localized "N result(s) found" text; singular form for a count of 1. */
export function formatResultCount(count: number, locale: Locale): string {
  const key = count === 1 ? 'search.announce.one' : 'search.announce.other';
  return interpolate(resolveTranslation(translations, key, locale), { count });
}

export function useI18n() {
  const locale = useState<Locale>('locale', () => 'en');

  function t(key: string, params?: Record<string, string | number>): string {
    return interpolate(resolveTranslation(translations, key, locale.value), params ?? {});
  }

  function toggleLocale() {
    locale.value = locale.value === 'pt' ? 'en' : 'pt';
    if (import.meta.client) {
      localStorage.setItem('locale', locale.value);
    }
  }

  onMounted(() => {
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved === 'pt' || saved === 'en') {
      locale.value = saved;
    }
    // default is already 'en' from useState initializer
  });

  return { locale, t, toggleLocale };
}
