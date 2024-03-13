import { fetchApi } from './config/index';

const endPoints = {
    getCars: 'api/cars',

    getCarsCreate: 'api/cars/create',
    getCarsUpdate: 'api/cars/update',
    
    getCarsDelete: 'api/cars/delete',
};

export const getCars = payload => fetchApi(endPoints.getCars, payload);
export const getCarsCreate = payload => fetchApi(endPoints.getCarsCreate, payload, 'post');
export const getCarsUpdate = (payload, id) => fetchApi(`${endPoints.getCarsUpdate}/${id}`, payload, 'post');
export const getCarsDelete = id => fetchApi(`${endPoints.getCarsDelete}/${id}`, {}, 'delete');