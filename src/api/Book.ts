// @ts-ignore
import Api from './Api';

class Book extends Api {
  constructor(url: string) {
    super(url);
  }
}

export default new Book('books');
