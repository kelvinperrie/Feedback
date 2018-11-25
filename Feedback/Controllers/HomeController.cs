using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Feedback.Models;

namespace Feedback.Controllers
{
    public class HomeController : Controller
    {
        private static readonly IList<FeedbackModel> _feedback;

        static HomeController()
        {
            _feedback = new List<FeedbackModel>
            {
                new FeedbackModel
                {
                    Id = 1,
                    Title = "The inpatient whiteboard is looking dated!",
                    Text = "Maybe we need some new colours on it or something? Maybe some funky gradients? It needs a refresh!",
                    Votes = 5,
                    VotedUp = false,
                    VotedDown = false
                },
                new FeedbackModel
                {
                    Id = 2,
                    Title = "An electronic solution for rostering & shifts",
                    Text = "I'm sick of cutting out photos and every shift having to stick them on the wall - can't we get something electronic to show us who is on each shift?",
                    Votes = 9,
                    VotedUp = false,
                    VotedDown = false
                },
                new FeedbackModel
                {
                    Id = 3,
                    Title = "Once place for referrals?",
                    Text = "There are so many places to go to do so many different referrals. It's really disjointed. Can't they be in one place? Or one place that links to the other places?",
                    Votes = 6,
                    VotedUp = false,
                    VotedDown = false
                },
                new FeedbackModel
                {
                    Id = 4,
                    Title = "There aren't enough cute pictures of animals in our applications",
                    Text = "Sometimes when working I'd like to see a kitten or baby hedgehog pop up in an application. It would brighten my day.",
                    Votes = 2,
                    VotedUp = false,
                    VotedDown = false
                },
            };
        }

        [Route("feedback/allfeedback")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult AllFeedback()
        {
            return Json(_feedback.OrderByDescending(f => f.Votes));
        }

        [Route("feedback/new")]
        [HttpPost]
        public ActionResult AddFeedback(FeedbackModel feedback)
        {
            // Create a fake ID for this comment
            feedback.Id = _feedback.Count + 1;
            feedback.Votes = 0;
            _feedback.Add(feedback);
            return Content("Success :)");
        }

        [Route("feedback/voteup")]
        [HttpPost]
        public ActionResult VoteUpFeedback(FeedbackModel feedback)
        {
            var feedbackItem = _feedback.FirstOrDefault(f => f.Id == feedback.Id);
            feedbackItem.Votes = feedbackItem.Votes + 1;
            if(feedbackItem.VotedDown)
            {
                feedbackItem.VotedDown = false;
            } else
            {
                feedbackItem.VotedUp = true;
            }
            
            return Content("Success :)");
        }

        [Route("feedback/votedown")]
        [HttpPost]
        public ActionResult VoteDownFeedback(FeedbackModel feedback)
        {
            var feedbackItem = _feedback.FirstOrDefault(f => f.Id == feedback.Id);
            feedbackItem.Votes = feedbackItem.Votes - 1;
            if (feedbackItem.VotedUp)
            {
                feedbackItem.VotedUp = false;
            }
            else
            {
                feedbackItem.VotedDown = true;
            }
            return Content("Success :)");
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
