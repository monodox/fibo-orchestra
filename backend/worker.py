# backend/worker.py
"""
RQ Worker for processing background jobs.
Run with: rq worker --url redis://localhost:6379/0
"""
from rq import Worker, Queue, Connection
from app.queue import redis_conn

if __name__ == '__main__':
    with Connection(redis_conn):
        worker = Worker(['default', 'batch'])
        worker.work()
