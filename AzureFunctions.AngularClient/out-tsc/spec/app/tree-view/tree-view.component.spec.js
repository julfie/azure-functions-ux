"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tree_node_iterator_1 = require("./tree-node-iterator");
var tree_node_1 = require("./tree-node");
var app_module_1 = require("./../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var tree_view_component_1 = require("./tree-view.component");
describe('TreeViewComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition)
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(tree_view_component_1.TreeViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should return the next sibling when not expanded', function () {
        var root = getMockTree();
        var iterator = new tree_node_iterator_1.TreeNodeIterator(root.children[0]);
        var results = ['a', 'b', null];
        runTest(root.children[0], results, true /* forward */);
    });
    it('should return the next siblings children when expanded', function () {
        var root = getMockTree();
        expandAllDescendants(root);
        var results = ['a', 'a1', 'a2', 'a2x', 'a3', 'b', 'b1', null];
        runTest(root.children[0], results, true /* forward */);
    });
    it('should return the previous sibling when not expanded', function () {
        var root = getMockTree();
        var startNode = root.children[root.children.length - 1];
        var iterator = new tree_node_iterator_1.TreeNodeIterator(startNode);
        var results = ['b', 'a', null];
        runTest(startNode, results, false /* backward */);
    });
    it('should return the previous siblings descendents when expanded', function () {
        var root = getMockTree();
        expandAllDescendants(root);
        var startNode = getLastDescendantNode(root);
        var iterator = new tree_node_iterator_1.TreeNodeIterator(startNode);
        var results = ['b1', 'b', 'a3', 'a2x', 'a2', 'a1', 'a', null];
        runTest(startNode, results, false /* backward */);
    });
    function getMockTree() {
        var root = new tree_node_1.TreeNode(null, null, null);
        root.title = "root";
        var a = new tree_node_1.TreeNode(null, null, root);
        a.title = "a";
        var a1 = new tree_node_1.TreeNode(null, null, a);
        a1.title = "a1";
        var a2 = new tree_node_1.TreeNode(null, null, a);
        a2.title = "a2";
        var a2x = new tree_node_1.TreeNode(null, null, a2);
        a2x.title = "a2x";
        var a3 = new tree_node_1.TreeNode(null, null, a);
        a3.title = "a3";
        var b = new tree_node_1.TreeNode(null, null, root);
        b.title = "b";
        var b1 = new tree_node_1.TreeNode(null, null, b);
        b1.title = "b1";
        root.children = [a, b];
        a.children = [a1, a2, a3];
        a2.children = [a2x];
        b.children = [b1];
        return root;
    }
    function runTest(startNode, results, forward) {
        var iterator = new tree_node_iterator_1.TreeNodeIterator(startNode);
        var curNode;
        ;
        var testNum = 1;
        do {
            if (forward) {
                curNode = iterator.next();
            }
            else {
                curNode = iterator.previous();
            }
            if (curNode) {
                expect(curNode.title).toEqual(results[testNum]);
            }
            else {
                expect(results[testNum]).toBeNull();
            }
            testNum++;
        } while (curNode && testNum < results.length);
        expect(testNum).toEqual(results.length);
    }
    function expandAllDescendants(node) {
        node.isExpanded = true;
        node.children.forEach(function (c) {
            expandAllDescendants(c);
        });
    }
    function getLastDescendantNode(node) {
        if (node.children.length > 0) {
            return getLastDescendantNode(node.children[node.children.length - 1]);
        }
        else {
            return node;
        }
    }
});
//# sourceMappingURL=tree-view.component.spec.js.map