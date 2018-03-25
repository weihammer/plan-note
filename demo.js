// 存取 localStorage 中的数据

var store = {
	save: function(key, value){
		localStorage.setItem(key, JSON.stringify(value));
	},
	fetch: function(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
};
var filter = {
	all: function(list){
		return list;
	},
	finish: function(list){
	  // console.log(1)
		return list.filter(function(item){
			return item.isChecked;
		})
	},
	unfinish: function(list){
  // console.log(3);
		return list.filter(function(item){
			return !item.isChecked;
		})
	}
};
// console.log(filter.all(1))

// 数据格式
/*var list = [
	{
		title: '开始使用任务计划列表吧',
		isChecked: false
	}
];
*/


var list = store.fetch('hu-todo');
var vm = new Vue({
	el: '#plan',
	data: {
		list: list,
		todo: '',
		editText: '',   // 记录正在编辑的数据
		beforeTitle:'', // esc取消编辑中, 保存原title
		visibal: 'all' , // 通过该值, 切换所有/完成/未完成任务
     active: [
        true, false, false
       ]
	},
	watch: {            // 监听list变化, 保存
		list: {
			handler: function(){
				store.save('hu-todo', this.list);
				whc();
			},
			deep: true  // 深层监控
		}
	},
	computed: {                                     // 计算属性
		noChecked: function(){
			return this.list.filter(function(item){
				return !item.isChecked
			}).length
		},
		filterList: function(){   // 根据visibal 进行过滤
			return filter[this.visibal] ? filter[this.visibal](this.list): this.list;
		}

	},
  mounted:function () {
    this.onFn(1);
  },
	// push, splice 是 vue 里的变异方法
	methods: {
		add: function(ev){
			// this 指向当前 根实例, 即 new Vue
			this.list.unshift({
				title: this.todo,
				isChecked: false
			});
			this.todo = '';
      // list=this.list;
		},
		del: function(todo){
			var index = this.list.indexOf(todo);
			this.list.splice(index, 1);
		},
		// 双击编辑效果失效
		editing: function(todo){
			this.editText = todo;
			this.beforeTitle = todo.title;
		},
		editFinish: function(todo){
			this.editText = '';
		},
		cancel: function(todo){ // 取消编辑
			todo.title = this.beforeTitle;
			// 同时改变 class
			this.editText = '';
		},
    onFn:function(index){
      this.active=[false,false,false];
      this.active[index]=true
    }
	},
	directives: {
		'focus': {
			update: function(el, binding){  // 自定义指令
				if( binding.value ){
					el.focus();
				}
			}
		}
	}
});

// watch hash change
function whc(){
  var hash = window.location.hash.slice(1);
  vm.visibal = hash;
  // console.log(2)
}
window.addEventListener('hashchange', function(){
  // console.log(55)
  whc();
});
