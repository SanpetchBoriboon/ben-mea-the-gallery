import { NextRequest, NextResponse } from 'next/server';

interface ApiImage {
  name: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
  publicUrl: string;
  signedUrl: string;
  exists: boolean;
  metadata: {
    firebaseStorageDownloadTokens: string;
  };
}

interface ApiResponse {
  message: string;
  images: ApiImage[];
  count: number;
  prefix: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const prefix = searchParams.get('prefix') || '';

  // Mock data for different categories
  const mockImagesData: { [key: string]: ApiImage[] } = {
    'our-gallery': [
      {
        name: 'our-gallery/our-gallery-01.jpg',
        size: 227904,
        contentType: 'image/jpeg',
        timeCreated: '2026-02-24T04:46:24.486Z',
        updated: '2026-02-24T04:46:24.486Z',
        publicUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-01.jpg',
        signedUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-01.jpg?GoogleAccessId=firebase-adminsdk-fbsvc%40wedding-day-5a5a1.iam.gserviceaccount.com&Expires=1771912017&Signature=RpKkaRI6g0v6FFlSbJMTTDiPUpw%2BArClsqL4xX2iTJ1QbSqJhCEhY%2BC5hteISV3wawbiK78uuQvHT1QwzxlzdnTydcuWX7dtw%2BYhedNCENzi3vVP%2BjaZmhsPLJVncSkJ8RZOOxnaVVDEB6yck0mERAKQyvdMeVm9LtOw%2FdqzynwWglo6qK71yTjR1mkrcvCCMVxvYlJRaqYCBY0LpHn%2BfvNGDt%2BP%2Fe%2BoF4Au8OPHqR%2BCIeiTw27nDbzblPulJ1cAkfGweGRZWt%2Bi6pzA4syLQTvfnAINjrbHp%2B3Ha%2Bjjr1OJg%2FXCH1w7Fto5igUMp8VQ8LTKZwPseO6wCAu55CWEOg%3D%3D',
        exists: true,
        metadata: {
          firebaseStorageDownloadTokens: 'd80a2c93-9da8-4aae-9484-461fcaa01911',
        },
      },
      {
        name: 'our-gallery/our-gallery-02.jpg',
        size: 318552,
        contentType: 'image/jpeg',
        timeCreated: '2026-02-24T04:46:24.788Z',
        updated: '2026-02-24T04:46:24.788Z',
        publicUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-02.jpg',
        signedUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-02.jpg?GoogleAccessId=firebase-adminsdk-fbsvc%40wedding-day-5a5a1.iam.gserviceaccount.com&Expires=1771912017&Signature=Xnv4DUBI0H9yLG9ntgOMA10S9ZtF8IcT4f0LWp4%2F3afMOlYeceF6wsnw%2BezLJx5GjmgkWsj0I8MKPQ2NXBdikUGk%2F8u9tMk2uJnUxccjTiG6iJqJnPQzsmfakSEvZm7TuWXHe8cePo7kWyi7lnzUDvoOrYPB81OkKKX5IULbxe9WvuZwjsYljRA8Sg1Xg1bv5sPoqc05hbWUVQGoL60dHygkJ1fzPfo5dYWf6awUDEmRB0kvwhAAi7VYbD4AE0rtjR%2FR%2FRjWiJpXJiUEElxMmF0ax7qMvpjZn%2FqATf21fIpQmnzNRMW3g9%2FkoTbOJZJW1k4vfMW40lZZgqxLq2%2BdBA%3D%3D',
        exists: true,
        metadata: {
          firebaseStorageDownloadTokens: 'e5a2b0ee-ded9-4490-a8a2-d187b855c7ca',
        },
      },
      {
        name: 'our-gallery/our-gallery-03.jpg',
        size: 150572,
        contentType: 'image/jpeg',
        timeCreated: '2026-02-24T04:46:25.258Z',
        updated: '2026-02-24T04:46:25.258Z',
        publicUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-03.jpg',
        signedUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-03.jpg?GoogleAccessId=firebase-adminsdk-fbsvc%40wedding-day-5a5a1.iam.gserviceaccount.com&Expires=1771912017&Signature=cSZI8UfjZSpVh%2Bz4Ox%2FVUvnkhwGvzJMR%2F4NcaIUPn6xptezo3v8YmAvM9uNKXD7pljB3H7BzHovuH5WUxrHU6yZhorheUB5bApJWaJC3jc2cnworrWmqZw2CTh5h4x5BSLsBtl2VguYurumzJE2v47xt51qJgZYF7RmGZzpVgaaK6AK4kylez5Pn%2FKz4tloqYz72moy3Y3sYfJWKDfj1PxNQbceWHLtpoH08tA0UuzFyWH2ivpQAWYUuyGbAQWzQ1u%2F7LeIw9afxUofLjWcm9Up09yvyIfxohVQxJfOt0iZK5vraXy1gBkRMfThWxh6tvhb4Bf0NO%2BcbPtrbMtqrJA%3D%3D',
        exists: true,
        metadata: {
          firebaseStorageDownloadTokens: '04a0eb3e-b3b0-4f0e-9172-2ba5088e0cad',
        },
      },
    ],
    wishes: [
      {
        name: 'wishes/wish-01.jpg',
        size: 180000,
        contentType: 'image/jpeg',
        timeCreated: '2026-02-24T04:46:24.486Z',
        updated: '2026-02-24T04:46:24.486Z',
        publicUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-01.jpg',
        signedUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-01.jpg?GoogleAccessId=firebase-adminsdk-fbsvc%40wedding-day-5a5a1.iam.gserviceaccount.com&Expires=1771912017&Signature=RpKkaRI6g0v6FFlSbJMTTDiPUpw%2BArClsqL4xX2iTJ1QbSqJhCEhY%2BC5hteISV3wawbiK78uuQvHT1QwzxlzdnTydcuWX7dtw%2BYhedNCENzi3vVP%2BjaZmhsPLJVncSkJ8RZOOxnaVVDEB6yck0mERAKQyvdMeVm9LtOw%2FdqzynwWglo6qK71yTjR1mkrcvCCMVxvYlJRaqYCBY0LpHn%2BfvNGDt%2BP%2Fe%2BoF4Au8OPHqR%2BCIeiTw27nDbzblPulJ1cAkfGweGRZWt%2Bi6pzA4syLQTvfnAINjrbHp%2B3Ha%2Bjjr1OJg%2FXCH1w7Fto5igUMp8VQ8LTKZwPseO6wCAu55CWEOg%3D%3D',
        exists: true,
        metadata: {
          firebaseStorageDownloadTokens: 'wish-token-01',
        },
      },
      {
        name: 'wishes/wish-02.jpg',
        size: 200000,
        contentType: 'image/jpeg',
        timeCreated: '2026-02-24T04:46:24.788Z',
        updated: '2026-02-24T04:46:24.788Z',
        publicUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-02.jpg',
        signedUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-02.jpg?GoogleAccessId=firebase-adminsdk-fbsvc%40wedding-day-5a5a1.iam.gserviceaccount.com&Expires=1771912017&Signature=Xnv4DUBI0H9yLG9ntgOMA10S9ZtF8IcT4f0LWp4%2F3afMOlYeceF6wsnw%2BezLJx5GjmgkWsj0I8MKPQ2NXBdikUGk%2F8u9tMk2uJnUxccjTiG6iJqJnPQzsmfakSEvZm7TuWXHe8cePo7kWyi7lnzUDvoOrYPB81OkKKX5IULbxe9WvuZwjsYljRA8Sg1Xg1bv5sPoqc05hbWUVQGoL60dHygkJ1fzPfo5dYWf6awUDEmRB0kvwhAAi7VYbD4AE0rtjR%2FR%2FRjWiJpXJiUEElxMmF0ax7qMvpjZn%2FqATf21fIpQmnzNRMW3g9%2FkoTbOJZJW1k4vfMW40lZZgqxLq2%2BdBA%3D%3D',
        exists: true,
        metadata: {
          firebaseStorageDownloadTokens: 'wish-token-02',
        },
      },
    ],
    photographer: [
      {
        name: 'photographer/photo-01.jpg',
        size: 250000,
        contentType: 'image/jpeg',
        timeCreated: '2026-02-24T04:46:24.486Z',
        updated: '2026-02-24T04:46:24.486Z',
        publicUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-03.jpg',
        signedUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-03.jpg?GoogleAccessId=firebase-adminsdk-fbsvc%40wedding-day-5a5a1.iam.gserviceaccount.com&Expires=1771912017&Signature=cSZI8UfjZSpVh%2Bz4Ox%2FVUvnkhwGvzJMR%2F4NcaIUPn6xptezo3v8YmAvM9uNKXD7pljB3H7BzHovuH5WUxrHU6yZhorheUB5bApJWaJC3jc2cnworrWmqZw2CTh5h4x5BSLsBtl2VguYurumzJE2v47xt51qJgZYF7RmGZzpVgaaK6AK4kylez5Pn%2FKz4tloqYz72moy3Y3sYfJWKDfj1PxNQbceWHLtpoH08tA0UuzFyWH2ivpQAWYUuyGbAQWzQ1u%2F7LeIw9afxUofLjWcm9Up09yvyIfxohVQxJfOt0iZK5vraXy1gBkRMfThWxh6tvhb4Bf0NO%2BcbPtrbMtqrJA%3D%3D',
        exists: true,
        metadata: {
          firebaseStorageDownloadTokens: 'photo-token-01',
        },
      },
      {
        name: 'photographer/photo-02.jpg',
        size: 280000,
        contentType: 'image/jpeg',
        timeCreated: '2026-02-24T04:46:24.788Z',
        updated: '2026-02-24T04:46:24.788Z',
        publicUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-01.jpg',
        signedUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-01.jpg?GoogleAccessId=firebase-adminsdk-fbsvc%40wedding-day-5a5a1.iam.gserviceaccount.com&Expires=1771912017&Signature=RpKkaRI6g0v6FFlSbJMTTDiPUpw%2BArClsqL4xX2iTJ1QbSqJhCEhY%2BC5hteISV3wawbiK78uuQvHT1QwzxlzdnTydcuWX7dtw%2BYhedNCENzi3vVP%2BjaZmhsPLJVncSkJ8RZOOxnaVVDEB6yck0mERAKQyvdMeVm9LtOw%2FdqzynwWglo6qK71yTjR1mkrcvCCMVxvYlJRaqYCBY0LpHn%2BfvNGDt%2BP%2Fe%2BoF4Au8OPHqR%2BCIeiTw27nDbzblPulJ1cAkfGweGRZWt%2Bi6pzA4syLQTvfnAINjrbHp%2B3Ha%2Bjjr1OJg%2FXCH1w7Fto5igUMp8VQ8LTKZwPseO6wCAu55CWEOg%3D%3D',
        exists: true,
        metadata: {
          firebaseStorageDownloadTokens: 'photo-token-02',
        },
      },
    ],
    album: [
      {
        name: 'album/album-01.jpg',
        size: 300000,
        contentType: 'image/jpeg',
        timeCreated: '2026-02-24T04:46:24.486Z',
        updated: '2026-02-24T04:46:24.486Z',
        publicUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-02.jpg',
        signedUrl:
          'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/our-gallery/our-gallery-02.jpg?GoogleAccessId=firebase-adminsdk-fbsvc%40wedding-day-5a5a1.iam.gserviceaccount.com&Expires=1771912017&Signature=Xnv4DUBI0H9yLG9ntgOMA10S9ZtF8IcT4f0LWp4%2F3afMOlYeceF6wsnw%2BezLJx5GjmgkWsj0I8MKPQ2NXBdikUGk%2F8u9tMk2uJnUxccjTiG6iJqJnPQzsmfakSEvZm7TuWXHe8cePo7kWyi7lnzUDvoOrYPB81OkKKX5IULbxe9WvuZwjsYljRA8Sg1Xg1bv5sPoqc05hbWUVQGoL60dHygkJ1fzPfo5dYWf6awUDEmRB0kvwhAAi7VYbD4AE0rtjR%2FR%2FRjWiJpXJiUEElxMmF0ax7qMvpjZn%2FqATf21fIpQmnzNRMW3g9%2FkoTbOJZJW1k4vfMW40lZZgqxLq2%2BdBA%3D%3D',
        exists: true,
        metadata: {
          firebaseStorageDownloadTokens: 'album-token-01',
        },
      },
    ],
  };

  // Get images for the specified category
  const selectedImages =
    mockImagesData[prefix] || mockImagesData['our-gallery'];

  const response: ApiResponse = {
    message: 'Images retrieved successfully',
    images: selectedImages,
    count: selectedImages.length,
    prefix: prefix,
  };

  return NextResponse.json(response);
}
