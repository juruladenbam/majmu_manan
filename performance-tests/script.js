import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp up to 20 users
        { duration: '1m', target: 20 },  // Stay at 20 users
        { duration: '10s', target: 0 },  // Ramp down to 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:8000';
    const res = http.get(`${BASE_URL}/api/bacaan`);
    check(res, {
        'is status 200': (r) => r.status === 200,
        'verify response time': (r) => r.timings.duration < 500,
    });
    sleep(1);
}
