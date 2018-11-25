
var Feedback = React.createClass({
    rawMarkup: function () {
        var md = new Remarkable();
        var rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    },
    render: function () {
        return (
            <div className="feedback row">
                <h2 className="feedbackTitle">
                    {this.props.title}
                </h2>
                <div className="voteBlock">
                    <i onClick={this.handleVoteUpSubmit} className={"material-icons vote-button noselect " + (this.props.votedUp ? "voted-up" : "")} title="vote up">add_circle_outline</i>
                    <span className="feedbackVotes">{this.props.votes}</span>
                    <i onClick={this.handleVoteDownSubmit} className={"material-icons vote-button noselect " + (this.props.votedDown ? "voted-down" : "")} title="vote down">remove_circle_outline</i>
                </div>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    },
    handleVoteSubmit: function (e) {
        this.props.onVoteSubmit(e);
    },
    handleVoteUpSubmit: function (e) {
        e.preventDefault();
        console.log(this.props.votedUp);
        if (this.props.votedUp) {
            this.handleVoteDownSubmit(e);
            return;
        }

        var data = new FormData();
        data.append('id', this.props.feedbackId);
        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.voteUpUrl, true);
        xhr.onload = function () {
            this.handleVoteSubmit(e);
        }.bind(this);
        xhr.send(data);
    },
    handleVoteDownSubmit: function (e) {
        e.preventDefault();
        if (this.props.votedDown) {
            this.handleVoteUpSubmit(e);
            return;
        }

        var data = new FormData();
        data.append('id', this.props.feedbackId);
        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.voteDownUrl, true);
        xhr.onload = function () {
            this.handleVoteSubmit(e);
        }.bind(this);
        xhr.send(data);
    }
});

var FeedbackList = React.createClass({
    render: function () {
        var self = this;
        if (!this.props.data) {
            return (<div>nothing</div>);
        }
        var feedbackNodes = this.props.data.map(function (feedback) {
            return (
                <Feedback title={feedback.title} votes={feedback.votes} votedUp={feedback.votedUp} votedDown={feedback.votedDown} key={feedback.id} feedbackId={feedback.id} voteUpUrl={self.props.voteUpUrl} voteDownUrl={self.props.voteDownUrl} onVoteSubmit={self.handleVoteSubmit}>
                    {feedback.text}
                </Feedback>
            );
        });
        return (
            <div className="feedbackList">
                {feedbackNodes}
            </div>
        );
    },
    handleVoteSubmit: function (e) {
        this.props.onVoteSubmit(e);
    }
});

var FeedbackForm = React.createClass({
    getInitialState: function () {
        return { title: '', text: '' };
    },
    handleTitleChange: function (e) {
        this.setState({ title: e.target.value });
    },
    handleTextChange: function (e) {
        this.setState({ text: e.target.value });
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var title = this.state.title.trim();
        var text = this.state.text.trim();
        if (!text || !title) {
            return;
        }
        this.props.onFeedbackSubmit({ title: title, text: text });
        // TODO: send request to the server
        this.setState({ title: '', text: '' });
    },
    render: function () {
        return (
            <form className="feedbackForm" onSubmit={this.handleSubmit}>
                <div className="new-feedback-preamble">Would you like to add something new?</div>
                <div className="form-group">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Title"
                        value={this.state.title}
                        onChange={this.handleTitleChange}
                    /><br/>
                    <textarea
                        className="form-control"
                        placeholder="Feedback/suggestion"
                        value={this.state.text}
                        onChange={this.handleTextChange}
                    >{this.handleTextChange}</textarea><br />
                </div>
                <input type="submit" value="Post" />
            </form>
        );
    }
});
var FeedbackBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadFeedbackFromServer: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        }.bind(this);
        xhr.send();
    },
    handleFeedbackSubmit: function (feedback) {
        var data = new FormData();
        data.append('title', feedback.title);
        data.append('text', feedback.text);

        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = function () {
            this.loadFeedbackFromServer();
        }.bind(this);
        xhr.send(data);
    },
    handleVoteSubmit: function (e) {
        this.loadFeedbackFromServer();
    },
    componentDidMount: function () {
        this.loadFeedbackFromServer();
        window.setInterval(this.loadFeedbackFromServer, this.props.pollInterval);
    },
    render: function () {
        return (
            <div className="feedbackBox">
                <FeedbackList data={this.state.data} voteUpUrl={this.props.voteUpUrl} voteDownUrl={this.props.voteDownUrl} onVoteSubmit={this.handleVoteSubmit} />
                <FeedbackForm onFeedbackSubmit={this.handleFeedbackSubmit} />
            </div>
        );
    }
});

var baseUrl = GetBaseUrl();
var feedbackDataUrl = GetFeedbackDataUrl();
var feedbackNewUrl = GetFeedbackNewUrl();
var feedbackVoteUp = GetFeedbackVoteUp();
var feedbackVoteDown = GetFeedbackVoteDown();

ReactDOM.render(
    <FeedbackBox url={feedbackDataUrl} submitUrl={feedbackNewUrl} voteUpUrl={feedbackVoteUp} voteDownUrl={feedbackVoteDown} pollInterval={20000}/>,
    document.getElementById('content')
);
