import PublicPortfolioController from './PublicPortfolioController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    PublicPortfolioController: Object.assign(PublicPortfolioController, PublicPortfolioController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers