import { call, put, takeLatest } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import { fetchStoriesSuccess, fetchStoriesFailure, fetchStoriesRequest } from './storiesSlice';
import { User } from './storiesSlice';
import { SagaIterator } from 'redux-saga';

function* fetchStoriesSaga(): SagaIterator {
  try {
    const response: AxiosResponse<User[]> = yield call(axios.get, 'http://192.168.0.111:8080/stories/feed', {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTU4MzkxNTUsImlhdCI6MTc1NTU3OTk1NSwidXNlcl9pZCI6NX0._3KtuMSNv4ah4HVSKBt5JkM8s--h9vtsMJQciwgrF8w',
      },
    });
    yield put(fetchStoriesSuccess(response.data));
  } catch (error: any) {
    yield put(fetchStoriesFailure(error.message));
  }
}

export default function* rootSaga(): SagaIterator {
  yield takeLatest(fetchStoriesRequest.type, fetchStoriesSaga);
}