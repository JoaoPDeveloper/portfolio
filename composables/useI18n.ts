type Locale = 'pt' | 'en';

const translations: Record<string, Record<Locale, string>> = {
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
  'projects.description': { pt: 'Projetos publicados com tecnologias, links e imagens atualizáveis.', en: 'Published projects with updatable technologies, links and images.' },

  // Stack
  'stack.label': { pt: 'Tech stack', en: 'Tech stack' },
  'stack.title': { pt: 'Ferramentas que uso para construir.', en: 'Tools I use to build.' },
  'stack.description': { pt: 'Stack atual com dados editáveis diretamente no repositório.', en: 'Current stack with data editable directly in the repository.' },

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
};

export function useI18n() {
  const locale = useState<Locale>('locale', () => 'en');

  function t(key: string): string {
    return translations[key]?.[locale.value] || key;
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
