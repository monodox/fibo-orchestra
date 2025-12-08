# backend/app/queue.py
import redis
from rq import Queue
from .config import settings

# Redis connection
redis_conn = redis.from_url(settings.REDIS_URL)

# RQ queues
default_queue = Queue('default', connection=redis_conn)
batch_queue = Queue('batch', connection=redis_conn)

def enqueue_batch_render(job_id: str, payload: dict):
    """Enqueue batch render job to RQ"""
    from .tasks import run_batch_render_redis
    job = batch_queue.enqueue(
        run_batch_render_redis,
        job_id,
        payload,
        job_timeout='1h'
    )
    return job.id

def get_job_status(job_id: str) -> dict:
    """Get job status from Redis"""
    from rq.job import Job
    try:
        job = Job.fetch(job_id, connection=redis_conn)
        return {
            "status": job.get_status(),
            "progress": job.meta.get("progress", 0),
            "result_url": job.result if job.is_finished else None,
            "error": str(job.exc_info) if job.is_failed else None
        }
    except Exception as e:
        return {"status": "not_found", "error": str(e)}
