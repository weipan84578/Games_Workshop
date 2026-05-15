class SaveSystem{
  constructor(){this.data=this.load()}
  load(){
    try{
      const raw=JSON.parse(localStorage.getItem(STORAGE)||'{}');
      return {
        ...clone(defaultSave),
        ...raw,
        progress:{...clone(defaultSave).progress,...(raw.progress||{})},
        settings:{...clone(defaultSave).settings,...(raw.settings||{})},
        stats:{...clone(defaultSave).stats,...(raw.stats||{})},
        leaderboard:raw.leaderboard||[]
      }
    }catch{return clone(defaultSave)}
  }
  save(){localStorage.setItem(STORAGE,JSON.stringify(this.data))}
}
