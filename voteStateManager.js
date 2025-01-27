class VoteManager {
    static instance = null; // Singleton instance
    constructor() {
      if (VoteManager.instance) {
        return VoteManager.instance; // Return the existing instance
      }
  
      // Initialize in-memory database
      this.voteData = new Map();
  
      VoteManager.instance = this; // Set the singleton instance
    }
    static getInstance() {
        if (!VoteManager.instance) {
            VoteManager.instance = new VoteManager();
        }
        return VoteManager.instance;
    }
  
    castVote(userAddress, obj) {
      console.log(typeof this.voteData);
      console.log(userAddress);
        if (this.hasVoted(userAddress)) {
          return false;
        }
        
        this.voteData.set(userAddress, obj); // Record the user's vote
        return true;
    }
    hasVoted(userAddress) {
      const data = this.voteData.get(userAddress);
      console.log(data);
      if(data == undefined){
        return false;
      }
      return true;
    }
    getAllVotes() {
        return this.voteData;
    }
    resetData() {
        this.voteData = new Map();
    }
}

module.exports = VoteManager.getInstance();
  