pipeline {
    agent any
    
    environment {
        APP_IMAGE = "attendance-app"
        TEST_IMAGE = "attendance-tests"
        CONTAINER_NAME = "attendance-container"
        APP_PORT = "3000"
    }
    
    stages {
        
        stage('Clone Application') {
            steps {
                echo 'Cloning application repository...'
                git branch: 'main',
                    url: 'https://github.com/huzaifa847/assignment_2.git'
            }
        }
        
        stage('Build Application Docker Image') {
            steps {
                echo 'Building Docker image for application...'
                sh 'docker build -t ${APP_IMAGE} .'
            }
        }
        
        stage('Stop Old Container') {
            steps {
                echo 'Stopping old container if running...'
                sh '''
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                '''
            }
        }
        
        stage('Deploy Application') {
            steps {
                echo 'Starting application container...'
                sh 'docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:3000 ${APP_IMAGE}'
                echo 'Waiting for app to start...'
                sh 'sleep 10'
            }
        }
        
        stage('Clone Test Repository') {
            steps {
                echo 'Cloning test repository...'
                dir('test-repo') {
                    git branch: 'main',
                        url: 'https://github.com/huzaifa847/attendance-tests.git'
                }
            }
        }
        
        stage('Build Test Docker Image') {
            steps {
                echo 'Building test Docker image...'
                dir('test-repo') {
                    sh 'docker build -t ${TEST_IMAGE} .'
                }
            }
        }
        
        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                sh '''
                    docker run --rm \
                        --network host \
                        -v ${WORKSPACE}/test-results:/app/test-results \
                        ${TEST_IMAGE} \
                        python -m pytest tests/attendance_test.py \
                        -v \
                        --html=/app/test-results/report.html \
                        --self-contained-html \
                        2>&1 | tee test-output.txt
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Sending email with test results...'
            script {
                def testOutput = ""
                try {
                    testOutput = readFile('test-output.txt')
                } catch (Exception e) {
                    testOutput = "Could not read test output"
                }
                
                def committerEmail = sh(
                    script: "git log -1 --pretty=format:'%ae'",
                    returnStdout: true
                ).trim()
                
                emailext(
                    subject: "Jenkins Test Results - Student Attendance System - Build #${BUILD_NUMBER}",
                    body: """
                    <h2>Jenkins Pipeline Test Results</h2>
                    <p><b>Build Status:</b> ${currentBuild.currentResult}</p>
                    <p><b>Build Number:</b> ${BUILD_NUMBER}</p>
                    <p><b>Application URL:</b> http://13.53.138.23:3000</p>
                    
                    <h3>Test Output:</h3>
                    <pre>${testOutput}</pre>
                    
                    <p>Please check Jenkins for full details: http://13.53.138.23:8080</p>
                    """,
                    to: "${committerEmail}",
                    mimeType: 'text/html',
                    attachmentsPattern: 'test-results/report.html'
                )
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
