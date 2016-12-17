var request = require('supertest');
var app = require('../app');

describe('testing API', function(){
  var server = app.listen(3000);

  it('responds to /', function testSlash(done){
    request(server)
      .get('/')
      .expect(302)
      .end(function(err, res){
        if (err) return done(err);
        done();
      })
  });
  it('404 on /url', function testPath(done){
    request(server)
      .get('/url')
      .expect(404)
      .end(function(err, res){
        if (err) return done(err);
        done();
      })
  });
  it('health returns 200', function testHealth(done){
    request(server)
      .get('/health')
      .expect(200, 'Server is up and running!')
      .end(function(err, res){
        if (err) return done(err);
        done();
      })
  })
});
