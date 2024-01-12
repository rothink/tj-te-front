import {createRouter, createWebHistory} from 'vue-router';
import BookList from './pages/book/List';
import AuthorList from './pages/author/List';
import SubjectList from './pages/subject/List';


const routes = [
  {
    path: '/books/list',
    component: BookList
  },
  {
    path: '/authors/list',
    component: AuthorList
  },
  {
    path: '/subjects/list',
    component: SubjectList
  },
]

// @ts-ignore
const router = createRouter({
  // @ts-ignore
  history: createWebHistory(),
  routes,
});

export default router;
