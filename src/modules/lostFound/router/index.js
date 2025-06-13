export default [
    {
        path: '/mypage/lost',
        name: 'LostItemList',
        component: () => import('../views/user/LostItemList.vue')
    },
    {
        path: '/mypage/lost/:id',
        name: 'LostItemDetail',
        component: () => import('../views/user/LostItemDetail.vue'),
        props: true
    },
    {
        path: '/mypage/lost/edit/:id',
        name: 'LostItemEdit',
        component: () => import('../components/LostItemEdit.vue'),
        props: true
    },
    {
        path: '/lost',
        name: 'LostPublicList',
        component: () => import('@/modules/lostFound/views/user/LostPublicList.vue')
    },
    {
        path: '/lost/:id',
        name: 'LostPublicDetail',
        component: () => import('@/modules/lostFound/views/user/LostPublicDetail.vue'),
        props: true
    },
    {
        path: '/lost/create',
        name: 'LostPublicCreate',
        component: () => import('@/modules/lostFound/views/user/LostPublicCreate.vue')
    },
    {
        path: '/found',
        name: 'FoundPublicList',
        component: () => import('@/modules/lostFound/views/user/FoundPublicList.vue')
    },
    {
        path: '/found/:id',
        name: 'FoundPublicDetail',
        component: () => import('@/modules/lostFound/views/user/FoundPublicDetail.vue'),
        props: true
    }
]
