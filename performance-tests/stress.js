import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '20s', target: 50 },  // Ramp to 50 users quickly
        { duration: '1m', target: 100 },  // Ramp to 100 users
        { duration: '30s', target: 200 }, // Spike to 200 users
        { duration: '1m', target: 200 },  // Sustain 200 users
        { duration: '30s', target: 0 },   // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'], // Relaxed threshold for stress test (1s)
        http_req_failed: ['rate<0.05'],    // Error rate should be less than 5%
    },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:8000';
    const res = http.get(`${BASE_URL}/api/bacaan`);
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    sleep(1);
}
