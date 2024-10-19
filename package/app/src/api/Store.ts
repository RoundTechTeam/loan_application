import { Api, getData } from '.';

export default {
  async upload(files: File[]): Promise<string[]> {
    if (files.length > 3) throw new Error('Max 3 files');

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return getData(
      await Api.client('/storage').post('', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      })
    );
  },
  async uploadBillReceipt(files: File[], alias: string): Promise<string[]> {
    if (files.length > 3) throw new Error('Max 3 files');

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return getData(
      await Api.client('/storage/bill-receipt', false).post(
        '/:alias',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
    );
  },
  async download(url: string) {
    return getData<string>(await Api.client('/storage').get(`?url=${url}`));
  },
};
