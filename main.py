import webapp2
import handlers

app = webapp2.WSGIApplication(debug=True)

app.router.add(webapp2.Route('/', handler=handlers.MainPageHandler))
app.router.add(webapp2.Route('/quiz', handler=handlers.QuizPageHandler))
app.router.add(webapp2.Route('/api/question', handler=handlers.QuestionApiHandler))
