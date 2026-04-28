import DashboardController from './DashboardController'
import ProjectController from './ProjectController'
import TechnologyController from './TechnologyController'
import ProfileController from './ProfileController'
import SocialLinkController from './SocialLinkController'
const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
ProjectController: Object.assign(ProjectController, ProjectController),
TechnologyController: Object.assign(TechnologyController, TechnologyController),
ProfileController: Object.assign(ProfileController, ProfileController),
SocialLinkController: Object.assign(SocialLinkController, SocialLinkController),
}

export default Admin