// src/router/routes/mypageRoutes.js
import MyPageMain from '@/modules/mypage/views/MyPageMain.vue'
import MyFavorites from '@/modules/mypage/views/MyFavorites.vue'
import ChangePassword from '@/modules/mypage/views/ChangePassword.vue'

export default [
    {
        path: '/mypage',
        component: MyPageMain,
        children: [
            { path: 'favorites', component: MyFavorites },
            { path: 'password', component: ChangePassword }
        ]
    }
]
