from random import shuffle
import logging
import json
import webapp2
import jinja2
import static_data
import os

templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(templates_dir))

class MainPageHandler(webapp2.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/html'
		self.response.out.write(jinja_env.get_template('index.html').render({'enumerated_clustres': enumerate(static_data.clustres)}))
		

class QuizPageHandler(webapp2.RequestHandler):
	def get(self):
		clustre = self.request.get('clustre')
		n = int( self.request.get('n') ) # Number of questions

		# TODO: Check if the test exists, if not redirect to home page
		
		# Randomize the list and only get the requested amount of questions
		question_ids = range(100)
		shuffle(question_ids)
		question_ids = question_ids[:n]

		# Get the first question in advance so the client doesn't have to load it with js
		first_question = static_data.questions[clustre][question_ids[0]]

		# Format the list for the view
		question_ids = ",".join(str(qid) for qid in question_ids)

		template_values = {
				'question_ids': question_ids,
				'first_question': first_question,
				'n': n,
				'clustre': clustre,
				'clustre_desc': [c['desc'] for c in static_data.clustres if c['abbr'] == clustre][0]
				}
		
		self.response.headers['Content-Type'] = 'text/html'
		self.response.out.write(jinja_env.get_template('quiz.html').render(template_values))

class QuestionApiHandler(webapp2.RequestHandler):
	def get(self):
		clustre = self.request.get('clustre')
		qid = int(self.request.get('qid'))

		self.response.headers['Content-Type'] = 'application/json'

		# TODO: Look for the clustre in the db, if it doesn't exist, err
		#	self.response.headers['Content-Type'] = 'application/json'
		#	self.response.out.write('{"error":"The clustre doesn\'t exist."}')

		self.response.out.write(json.dumps(static_data.questions[clustre][qid]));
