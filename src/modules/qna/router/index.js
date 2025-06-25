export default [
  {
    path: 'qna',
    name: 'AdminQnaList',
    component: () => import('@/modules/qna/QnaList.vue')
  },
  {
    path: 'qna/:id/answer',
    name: 'AdminQnaAnswerWrite',
    component: () => import('@/modules/qna/QnaAnswerWrite.vue')
  },
  {
    path: 'qna/:id/edit',
    name: 'AdminQnaAnswerEdit',
    component: () => import('@/modules/qna/QnaAnswerEdit.vue')
  },
  {
    path: 'qna/:id',
    name: 'AdminQnaDetail',
    component: () => import('@/modules/qna/QnaDetail.vue')
  }
] 