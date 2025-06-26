export default [
  {
    path: 'qna',
    name: 'AdminQnaList',
    component: () => import('@/modules/qna/admin/QnaList.vue')
  },
  {
    path: 'qna/:id/answer',
    name: 'AdminQnaAnswerWrite',
    component: () => import('@/modules/qna/admin/QnaAnswerWrite.vue')
  },
  {
    path: 'qna/:id/edit',
    name: 'AdminQnaAnswerEdit',
    component: () => import('@/modules/qna/admin/QnaAnswerEdit.vue')
  },
  {
    path: 'qna/:id',
    name: 'AdminQnaDetail',
    component: () => import('@/modules/qna/admin/QnaDetail.vue')
  }
] 