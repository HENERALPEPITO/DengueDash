FROM python:3.12 AS builder

# Create the app directory
RUN mkdir /denguedash-api

# Set the working directory
WORKDIR /denguedash-api

# Set environment variables
# Prevents Python from writing .pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1

# Upgrade pip
RUN pip install --upgrade pip

# Copy the django project and install dependencies
COPY requirements.txt /denguedash-api/
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.12

RUN useradd -m -r appuser && \
    mkdir -p /denguedash-api && \
    chown -R appuser:appuser /denguedash-api

# Copy the dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Set the working directory
WORKDIR /denguedash-api

# Copy the application code
COPY --chown=appuser:appuser . .

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Switch to the non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 8000
