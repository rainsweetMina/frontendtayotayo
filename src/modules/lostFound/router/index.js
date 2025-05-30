export default [
    {
        path: '/mypage/lost',
        name: 'LostItemList',
        component: () => import('../views/user/LostItemList.vue')
    },
    {
        path: '/mypage/lost/:id',
        name: 'LostItemDetail',
        component: () => import('../components/LostItemEdit.vue'),
        props: true
    },
    {
        path: '/lost',
        name: 'LostPublicList',
        component: () => import('@/modules/lostFound/views/user/LostPublicList.vue')
    }



]
