using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Feedback.Models
{
    public class FeedbackModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public int Votes { get; set; }
        public bool VotedUp { get; set; }
        public bool VotedDown { get; set; }
    }
}
