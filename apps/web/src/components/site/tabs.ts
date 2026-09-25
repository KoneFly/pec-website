/** 多页共用的可访问选项卡：方向键/Home/End导航，Enter/点击选择。 */
export function initializeTabs() {
  document.querySelectorAll<HTMLElement>('[data-tabset]').forEach(root => {
    if (root.dataset.tabsReady) return;
    root.dataset.tabsReady = 'true';
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const select = (tab: HTMLButtonElement) => {
      tabs.forEach(item => {
        const active = item === tab;
        item.setAttribute('aria-selected',String(active)); item.tabIndex = active ? 0 : -1;
        const panel = root.querySelector<HTMLElement>(`#${item.getAttribute('aria-controls')}`);
        if (panel) panel.hidden = !active;
      });
    };
    tabs.forEach((tab,index) => {
      tab.addEventListener('click',()=>select(tab));
      tab.addEventListener('keydown',event => {
        let next = index;
        if (event.key==='ArrowRight' || event.key==='ArrowDown') next=(index+1)%tabs.length;
        else if (event.key==='ArrowLeft' || event.key==='ArrowUp') next=(index-1+tabs.length)%tabs.length;
        else if(event.key==='Home') next=0;
        else if(event.key==='End') next=tabs.length-1;
        else return;
        event.preventDefault(); tabs[next].focus(); select(tabs[next]);
      });
    });
  });
}
