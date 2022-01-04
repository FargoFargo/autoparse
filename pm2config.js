module.exports = {
    apps : [{
      name: 'Understat parser',
      script: './index.js',
      cron_restart: '*/1 * * * *',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }]
  }