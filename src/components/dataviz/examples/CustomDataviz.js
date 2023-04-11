import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  Segment,
  Form,
  Header
} from 'semantic-ui-react';

import { DatavizCardSplit } from "../../DatavizCards";
import BarChart from "../BarChart";
import SankeyChart from "../SankeyChart";

const nameCategory = { "inputCheckbox": "Checkboxes", "inputField": "Short answer", "inputRadio": "Multiple choice", "inputTextarea": "Paragraph", "inputSlider": "Slider", "inputDate": "Date", "inputNames": "Interactions" };
const engStopwords = ["able","about","above","abroad","according","accordingly","across","actually","adj","after","afterwards","again","against","ago","ahead","ain't","all","allow","allows","almost","alone","along","alongside","already","also","although","always","am","amid","amidst","among","amongst","an","and","another","any","anybody","anyhow","anyone","anything","anyway","anyways","anywhere","apart","appear","appreciate","appropriate","are","aren't","around","as","a's","aside","ask","asking","associated","at","available","away","awfully","back","backward","backwards","be","became","because","become","becomes","becoming","been","before","beforehand","begin","behind","being","believe","below","beside","besides","best","better","between","beyond","both","brief","but","by","came","can","cannot","cant","can't","caption","cause","causes","certain","certainly","changes","clearly","c'mon","co","co.","com","come","comes","concerning","consequently","consider","considering","contain","containing","contains","corresponding","could","couldn't","course","c's","currently","dare","daren't","definitely","described","despite","did","didn't","different","directly","do","does","doesn't","doing","done","don't","down","downwards","during","each","edu","eg","eight","eighty","either","else","elsewhere","end","ending","enough","entirely","especially","et","etc","even","ever","evermore","every","everybody","everyone","everything","everywhere","ex","exactly","example","except","fairly","far","farther","few","fewer","fifth","first","five","followed","following","follows","for","forever","former","formerly","forth","forward","found","four","from","further","furthermore","get","gets","getting","given","gives","go","goes","going","gone","got","gotten","greetings","had","hadn't","half","happens","hardly","has","hasn't","have","haven't","having","he","he'd","he'll","hello","help","hence","her","here","hereafter","hereby","herein","here's","hereupon","hers","herself","he's","hi","him","himself","his","hither","hopefully","how","howbeit","however","hundred","i'd","ie","if","ignored","i'll","i'm","immediate","in","inasmuch","inc","inc.","indeed","indicate","indicated","indicates","inner","inside","insofar","instead","into","inward","is","isn't","it","it'd","it'll","its","it's","itself","i've","just","k","keep","keeps","kept","know","known","knows","last","lately","later","latter","latterly","least","less","lest","let","let's","like","liked","likely","likewise","little","look","looking","looks","low","lower","ltd","made","mainly","make","makes","many","may","maybe","mayn't","me","mean","meantime","meanwhile","merely","might","mightn't","mine","minus","miss","more","moreover","most","mostly","mr","mrs","much","must","mustn't","my","myself","name","namely","nd","near","nearly","necessary","need","needn't","needs","neither","never","neverf","neverless","nevertheless","new","next","nine","ninety","no","nobody","non","none","nonetheless","noone","nor","normally","not","nothing","notwithstanding","novel","now","nowhere","obviously","of","off","often","oh","ok","okay","old","on","once","one","ones","one's","only","onto","opposite","or","other","others","otherwise","ought","oughtn't","our","ours","ourselves","out","outside","over","overall","own","particular","particularly","past","per","perhaps","placed","please","plus","possible","presumably","probably","provided","provides","que","quite","qv","rather","rd","re","really","reasonably","recent","recently","regarding","regardless","regards","relatively","respectively","right","round","said","same","saw","say","saying","says","second","secondly","see","seeing","seem","seemed","seeming","seems","seen","self","selves","sensible","sent","serious","seriously","seven","several","shall","shan't","she","she'd","she'll","she's","should","shouldn't","since","six","so","some","somebody","someday","somehow","someone","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specified","specify","specifying","still","sub","such","sup","sure","take","taken","taking","tell","tends","th","than","thank","thanks","thanx","that","that'll","thats","that's","that've","the","their","theirs","them","themselves","then","thence","there","thereafter","thereby","there'd","therefore","therein","there'll","there're","theres","there's","thereupon","there've","these","they","they'd","they'll","they're","they've","thing","things","think","third","thirty","this","thorough","thoroughly","those","though","three","through","throughout","thru","thus","till","to","together","too","took","toward","towards","tried","tries","truly","try","trying","t's","twice","two","un","under","underneath","undoing","unfortunately","unless","unlike","unlikely","until","unto","up","upon","upwards","us","use","used","useful","uses","using","usually","v","value","various","versus","very","via","viz","vs","want","wants","was","wasn't","way","we","we'd","welcome","well","we'll","went","were","we're","weren't","we've","what","whatever","what'll","what's","what've","when","whence","whenever","where","whereafter","whereas","whereby","wherein","where's","whereupon","wherever","whether","which","whichever","while","whilst","whither","who","who'd","whoever","whole","who'll","whom","whomever","who's","whose","why","will","willing","wish","with","within","without","wonder","won't","would","wouldn't","yes","yet","you","you'd","you'll","your","you're","yours","yourself","yourselves","you've","zero","a","how's","i","when's","why's","b","c","d","e","f","g","h","j","l","m","n","o","p","q","r","s","t","u","uucp","w","x","y","z","I","www","amount","bill","bottom","call","computer","con","couldnt","cry","de","describe","detail","due","eleven","empty","fifteen","fifty","fill","find","fire","forty","front","full","give","hasnt","herse","himse","interest","itse”","mill","move","myse”","part","put","show","side","sincere","sixty","system","ten","thick","thin","top","twelve","twenty","abst","accordance","act","added","adopted","affected","affecting","affects","ah","announce","anymore","apparently","approximately","aren","arent","arise","auth","beginning","beginnings","begins","biol","briefly","ca","date","ed","effect","etal","ff","fix","gave","giving","heres","hes","hid","home","id","im","immediately","importance","important","index","information","invention","itd","keys","kg","km","largely","lets","line","'ll","means","mg","million","ml","mug","na","nay","necessarily","nos","noted","obtain","obtained","omitted","ord","owing","page","pages","poorly","possibly","potentially","pp","predominantly","present","previously","primarily","promptly","proud","quickly","ran","readily","ref","refs","related","research","resulted","resulting","results","run","sec","section","shed","shes","showed","shown","showns","shows","significant","significantly","similar","similarly","slightly","somethan","specifically","state","states","stop","strongly","substantially","successfully","sufficiently","suggest","thered","thereof","therere","thereto","theyd","theyre","thou","thoughh","thousand","throug","til","tip","ts","ups","usefully","usefulness","'ve","vol","vols","wed","whats","wheres","whim","whod","whos","widely","words","world","youd","youre"];


const CustomDataviz = (props) => {
  const [listQuestions, setListQuestions] = useState([]);
  const [questionInfos, setQuestionInfos] = useState({});
  const [selectQuestion, setSelectQuestion] = useState(null);
  const [listDataviz, setListDataviz] = useState([]);
  const [selectDataviz, setSelectDataviz] = useState(null);

  const [dataviz, setDataviz] = useState(null);

  const [listParamsSankey, setListParamsSankey] = useState([]);
  const [selectParamsSankey, setSelectParamsSankey] = useState([]);

  useEffect(() => {
    let newListQuestions = [];
    let newQuestionInfos = [];
    let i = 0;

    Object.entries(props.answers).map(([surveyName, titles]) => {
      Object.entries(titles).map(([title, info_answers]) => {
        if(info_answers.category !== "inputNames" && info_answers.answers.length > 0) {
          newListQuestions.push({
            key: i,
            text: surveyName + ": " + title,
            value: i
          })

          newQuestionInfos.push({
            surveyName: surveyName,
            title: title,
            category: info_answers.category
          })

          i++;
        }
      })
    })

    setListQuestions(newListQuestions);
    setQuestionInfos(newQuestionInfos);

  }, [props])

  useEffect(() => {
    if(selectQuestion !== null) {
      setSelectDataviz(null);
      setDataviz(null);
      setSelectParamsSankey([]);
      setListParamsSankey([]);

      switch(questionInfos[selectQuestion].category) {
        case "inputRadio":
          setListDataviz([
            {
              key: 0,
              text: "BarChart Teams",
              value: 1
            },
            {
              key: 1,
              text: "BarChart Participants",
              value: 2
            }
          ]);
          setSelectDataviz(1);

          break;
        case "inputCheckbox":
          setListDataviz([
            {
              key: 0,
              text: "SankeyChart",
              value: 3
            }
          ]);
          setSelectDataviz(3);

          let contents = [];

          props.answers[questionInfos[selectQuestion].surveyName][questionInfos[selectQuestion].title].answers.map((answer) => {
            Object.keys(answer.answer).map((content) => {
              if(answer.answer[content] && content !== "") {
                if(!(contents.includes(content))) {
                  contents.push(content);
                }
              }
            })
          })

          contents.sort((c1, c2) => c1.toLowerCase() > c2.toLowerCase() ? 1 : -1);

          let newListParamsSankey = [];
          contents.map((content, i) => {
            newListParamsSankey.push({
              key: i,
              text: content,
              value: content
            })
          })
          setListParamsSankey(newListParamsSankey);
          setSelectParamsSankey(contents);
          break;
        case "inputTextarea":
          setListDataviz([
            {
              key: 0,
              text: "Frequency of words",
              value: 4
            }
          ]);
          setSelectDataviz(4);

          break;
        default:
          setListDataviz([
            {
              key: 0,
              text: "Visualization not available",
              value: 0
            }
          ]);
          setSelectDataviz(0);
          break;
      }
    }
  }, [selectQuestion])

  useEffect(() => {
    if(selectDataviz !== null) {
      switch(selectDataviz) {
        case 1:
          plotBarChart(props.answers[questionInfos[selectQuestion].surveyName][questionInfos[selectQuestion].title].answers, true);
          break;
        case 2:
          plotBarChart(props.answers[questionInfos[selectQuestion].surveyName][questionInfos[selectQuestion].title].answers, false);
          break;
        case 3:
          plotSankeyChart(props.answers[questionInfos[selectQuestion].surveyName][questionInfos[selectQuestion].title].answers, selectParamsSankey);
          break;
        case 4:
          plotFrequencyWords(props.answers[questionInfos[selectQuestion].surveyName][questionInfos[selectQuestion].title].answers);
        default:
          break;
      }
    }
  }, [selectDataviz, selectParamsSankey])

  const plotFrequencyWords = (raw_answers) => {
    let data = [];
    let keys = [];
    let colors = {};

    let answers = {};

    raw_answers.map((answer) => {
      let answer_clean = answer.answer.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\r\n]/g, "");
      answer_clean.split(" ").map((word) => {
        let word_clean = word.toLowerCase();

        if(word_clean !== "" && isNaN(word_clean) && !(engStopwords.includes(word_clean))) {
          if(!(word_clean in answers)) {
            answers[word_clean] = 0;
          }

          answers[word_clean] += 1;
        }
      })
    })

    const listAscending = Object.keys(answers).sort((w1, w2) => answers[w1] < answers[w2] ? 1 : -1);

    let maxWords = listAscending.length;
    if(maxWords > 10) {
      maxWords = 10;
    }

    for(let i=0; i<maxWords; i++) {
      let entry = { "answer": listAscending[i] }
      keys.push(listAscending[i]);

      entry[listAscending[i]] = answers[listAscending[i]];
      data.push(entry);
    }

    setDataviz(
      <BarChart data={data} keys={keys} colors={colors} />
    )
  }

  const plotBarChart = (raw_answers, is_team) => {
    let data = [];
    let keys = [];
    let colors = {};

    let answers = {};
    let proportion = {};

    raw_answers.map((answer) => {
      if(!(answer.answer in answers)) {
        answers[answer.answer] = {};
        proportion[answer.answer] = 0;
      }

      if(is_team) {
        if(!(answer.team in answers[answer.answer])) {
          answers[answer.answer][answer.team] = 0;
          colors[answer.team] = props.colors[answer.team_index % props.colors.length];
        }
        answers[answer.answer][answer.team] += 1;
      } else {
        if(!(answer.team in answers[answer.answer])) {
          answers[answer.answer][answer.participantName] = 0;
          colors[answer.participantName] = props.colors[answer.team_index % props.colors.length];
        }
        answers[answer.answer][answer.participantName] += 1;
      }

      proportion[answer.answer] += 1
    })


    Object.keys(answers).sort((a1, a2) => proportion[a1] < proportion[a2] ? 1 : -1).map((answer) => {
      let entry = { "answer": answer }

      Object.keys(answers[answer]).map((criterium) => {
        if(!(keys.includes(criterium))) {
          keys.push(criterium);
        }
        entry[criterium] = answers[answer][criterium];
      })
      data.push(entry);
    })

    if(selectDataviz === 0) {
      keys.sort((c1, c2) => c1.toLowerCase() > c2.toLowerCase() ? 1 : -1);
    } else {
      keys.sort((c1, c2) => props.mapPartTeam[c1] > props.mapPartTeam[c2] ? 1 : -1);
    }

    setDataviz(
      <BarChart data={data} keys={keys} colors={colors} />
    )
  }

  const plotSankeyChart = (raw_answers, contents) => {
    let colors = {};
    let teams = {};

    raw_answers.map((answer) => {
      if(!(answer.team in teams)) {
        teams[answer.team] = {};
        colors[answer.team] = props.colors[answer.team_index % props.colors.length];
      }

      Object.keys(answer.answer).map((content) => {
        if(answer.answer[content]) {
          if(!(content in teams[answer.team])) {
            teams[answer.team][content] = 0;
          }

          teams[answer.team][content] += 1
        }
      })
    })

    let data = {"nodes": [], "links": []};

    Object.keys(teams).map((team) => {
      data.nodes.push({
        "id": team,
        "nodeColor": colors[team]
      })

      Object.keys(teams[team]).map((content) => {
        if(contents.includes(content)) {
          data.links.push({
            "source": team,
            "target": content,
            "value": teams[team][content]
          })
        }
      })
    })

    contents.map((content) => {
      data.nodes.push({
        "id": content,
        "nodeColor": "#FFF000"
      })
    })

    setDataviz(
      <SankeyChart data={data} colors={colors} />
    )
  }

  return (
    <>
    <Segment inverted attached="top">
      <Header as="h4">Create your own dataviz:</Header>
    </Segment>
    <Segment attached>
      <Form>
        <Form.Dropdown label="Select the question you want to visualize" fluid selection options={listQuestions} onChange={(e, {value}) => setSelectQuestion(value)} value={selectQuestion} />
        { listDataviz.length > 0 ?
            <Form.Dropdown label="Select the type of visualization" fluid selection options={listDataviz} onChange={(e, {value}) => setSelectDataviz(value)} value={selectDataviz} />
          :
            null
        }
        { listParamsSankey.length > 0 ?
            <Form.Dropdown label="Sankey parameters" fluid multiple selection options={listParamsSankey} onChange={(e, {value}) => setSelectParamsSankey(value)} value={selectParamsSankey} />
          :
            null
        }
      </Form>

      <DatavizCardSplit
        title="Program overview"
        dataviz={dataviz}
        unique_id="Network"
      >
      </DatavizCardSplit>
    </Segment>
    </>
  )
}

export default CustomDataviz;
