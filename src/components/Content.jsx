import React, {Component} from 'react'
import Sidebar from './sidebar/Sidebar'
import MainContent from './main/MainContent'
import './Content.css'

class Content extends Component{
  render(){
    return(
  <div className="App">
    <Sidebar className="left-section"
              authors={this.props.authors}
              authorImages={this.props.authorImages}
              setAuthor={this.props.setAuthor}
              setPhrase={this.props.setPhrase}
              language={this.props.language}
            />
     <section className="right-section">
       
         
    <MainContent
          language={this.props.language}
          mainImage={this.props.mainImage}
          chosenAuthor={this.props.chosenAuthor}
          currentQuotes={this.props.currentQuotes}
        />
           
      </section>

    </div>
    );
  }
};
export default Content;
