pipeline {
    agent any

    environment {
        APP_IMAGE    = "attendance-app"
        TEST_IMAGE   = "attendance-tests"
        CONTAINER_NAME = "attendance-container"
        APP_PORT     = "3000"
        APP_URL      = "http://13.53.138.23:3000"
    }

    stages {

        stage('Clone Application') {
            steps {
                echo '>>> Cloning application repository...'
                git branch: 'main',
                    url: 'https://github.com/huzaifa847/assignment_2.git'
            }
        }
    stage('Clean Docker Space') {
    steps {
        echo '>>> Freeing up disk space...'
        sh 'docker system prune -af || true' 
    }
}
        stage('Build App Docker Image') {
            steps {
                echo '>>> Building Docker image for Next.js app...'
                sh '''
                    docker build \
                        --build-arg MONGODB_URI="mongodb://amirzari53143_db_user:amir@ac-odolqzq-shard-00-00.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-01.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-02.cdh5paf.mongodb.net:27017/?ssl=true&replicaSet=atlas-i4bd2v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Huzaifadevops" \
                        --build-arg JWT_SECRET="supersecretjwtkey_123456789" \
                        -t ${APP_IMAGE} .
                '''
            }
        }

        stage('Stop Old Container') {
            steps {
                echo '>>> Removing old container if exists...'
                sh '''
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                echo '>>> Starting application container...'
                sh '''
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${APP_PORT}:3000 \
                        -e MONGODB_URI="mongodb://amirzari53143_db_user:amir@ac-odolqzq-shard-00-00.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-01.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-02.cdh5paf.mongodb.net:27017/?ssl=true&replicaSet=atlas-i4bd2v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Huzaifadevops" \
                        -e JWT_SECRET="supersecretjwtkey_123456789" \
                        -e NODE_ENV="production" \
                        ${APP_IMAGE}
                '''
                echo '>>> Waiting 20 seconds for app to fully start...'
                sh 'sleep 20'
            }
        }

        stage('Verify App is Running') {
            steps {
                echo '>>> Checking if app is responding...'
                sh '''
                    for i in 1 2 3 4 5; do
                        STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
                        echo "Attempt $i - HTTP Status: $STATUS"
                        if [ "$STATUS" = "200" ]; then
                            echo "App is UP!"
                            exit 0
                        fi
                        sleep 5
                    done
                    echo "WARNING: App may not be fully ready but continuing..."
                '''
            }
        }

        stage('Clone Test Repository') {
            steps {
                echo '>>> Cloning test repository...'
                dir('test-repo') {
                    git branch: 'main',
                        url: 'https://github.com/huzaifa847/attendance-tests.git'
                }
            }
        }

        stage('Build Test Docker Image') {
            steps {
                echo '>>> Building Selenium test Docker image...'
                dir('test-repo') {
                    sh 'docker build -t ${TEST_IMAGE} .'
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo '>>> Running 25 Selenium test cases...'
                sh '''
                    mkdir -p ${WORKSPACE}/test-results

                    docker run --rm \
                        --network host \
                        -v ${WORKSPACE}/test-results:/app/test-results \
                        ${TEST_IMAGE} \
                        python -m pytest tests/attendance_test.py \
                            -v \
                            --tb=short \
                            --html=/app/test-results/report.html \
                            --self-contained-html \
                            -p no:warnings \
                        2>&1 | tee ${WORKSPACE}/test-output.txt || true
                '''
            }
        }
    }

    post {
        always {
            echo '>>> Sending email with test results...'
            script {
                def testOutput = ""
                try {
                    testOutput = readFile("${WORKSPACE}/test-output.txt")
                } catch (Exception e) {
                    testOutput = "Could not read test output file."
                }

                def committerEmail = ""
                try {
                    committerEmail = sh(
                        script: "git log -1 --pretty=format:'%ae'",
                        returnStdout: true
                    ).trim().replaceAll("'", "")
                } catch (Exception e) {
                    committerEmail = "huzaifasamad18@gmail.com"
                }

                if (!committerEmail || committerEmail == "") {
                    committerEmail = "huzaifasamad18@gmail.com"
                }

                def buildStatus = currentBuild.currentResult ?: "UNKNOWN"

                def passCount = 0
                def failCount = 0
                try {
                    def matcher = testOutput =~ /(\d+) passed/
                    if (matcher) passCount = matcher[0][1].toInteger()
                    def failMatcher = testOutput =~ /(\d+) failed/
                    if (failMatcher) failCount = failMatcher[0][1].toInteger()
                } catch (Exception e) {}

                emailext(
                    subject: "[Jenkins] Student Attendance Tests - Build #${BUILD_NUMBER} - ${buildStatus}",
                    to: "${committerEmail}",
                    mimeType: 'text/html',
                    attachmentsPattern: 'test-results/report.html',
                    body: """
<html>
<body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">

<div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 30px; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Student Attendance System</h1>
    <p style="color: #c7d2fe; margin: 5px 0 0 0;">Jenkins Automated Test Results</p>
</div>

<div style="background: #f8fafc; padding: 25px; border: 1px solid #e2e8f0;">

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
            <td style="padding: 10px; background: #fff; border: 1px solid #e2e8f0; font-weight: bold;">Build Status</td>
            <td style="padding: 10px; background: #fff; border: 1px solid #e2e8f0; color: ${buildStatus == 'SUCCESS' ? '#16a34a' : '#dc2626'}; font-weight: bold;">${buildStatus}</td>
        </tr>
        <tr>
            <td style="padding: 10px; background: #f1f5f9; border: 1px solid #e2e8f0; font-weight: bold;">Build Number</td>
            <td style="padding: 10px; background: #f1f5f9; border: 1px solid #e2e8f0;">#${BUILD_NUMBER}</td>
        </tr>
        <tr>
            <td style="padding: 10px; background: #fff; border: 1px solid #e2e8f0; font-weight: bold;">Tests Passed</td>
            <td style="padding: 10px; background: #fff; border: 1px solid #e2e8f0; color: #16a34a; font-weight: bold;">${passCount}</td>
        </tr>
        <tr>
            <td style="padding: 10px; background: #f1f5f9; border: 1px solid #e2e8f0; font-weight: bold;">Tests Failed</td>
            <td style="padding: 10px; background: #f1f5f9; border: 1px solid #e2e8f0; color: ${failCount > 0 ? '#dc2626' : '#16a34a'}; font-weight: bold;">${failCount}</td>
        </tr>
        <tr>
            <td style="padding: 10px; background: #fff; border: 1px solid #e2e8f0; font-weight: bold;">Application URL</td>
            <td style="padding: 10px; background: #fff; border: 1px solid #e2e8f0;"><a href="${APP_URL}">${APP_URL}</a></td>
        </tr>
        <tr>
            <td style="padding: 10px; background: #f1f5f9; border: 1px solid #e2e8f0; font-weight: bold;">Triggered By</td>
            <td style="padding: 10px; background: #f1f5f9; border: 1px solid #e2e8f0;">${committerEmail}</td>
        </tr>
        <tr>
            <td style="padding: 10px; background: #fff; border: 1px solid #e2e8f0; font-weight: bold;">Jenkins URL</td>
            <td style="padding: 10px; background: #fff; border: 1px solid #e2e8f0;"><a href="http://13.53.138.23:8080">http://13.53.138.23:8080</a></td>
        </tr>
    </table>

    <h3 style="color: #1e293b; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">Test Output</h3>
    <pre style="background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto; font-size: 12px; line-height: 1.6;">${testOutput}</pre>

    <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
        Full HTML report is attached to this email.<br>
        This email was automatically generated by Jenkins pipeline.
    </p>
</div>

</body>
</html>
                    """
                )
                echo "Email sent to: ${committerEmail}"
            }
        }

        success {
            echo '>>> Pipeline completed SUCCESSFULLY!'
        }

        failure {
            echo '>>> Pipeline FAILED! Check logs above.'
        }
    }
}
