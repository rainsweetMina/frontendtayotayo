import busFareRoutes from '../busFare/router'
import busCompanyRoutes from '../busCompany/router'
import busStopInfoRoutes from '../busStopInfo/router'
import busScheduleRoutes from '../busSchedule/router'
import TermsOfService from '../terms/views/TermsOfService.vue'

const boardRoutes = [
    ...busFareRoutes,
    ...busCompanyRoutes,
    ...busStopInfoRoutes,
    ...busScheduleRoutes,
    {
        path: '/terms',
        name: 'terms',
        component: TermsOfService,
        meta: {
            title: '이용약관',
            layout: 'default'
        }
    }
]

export default boardRoutes