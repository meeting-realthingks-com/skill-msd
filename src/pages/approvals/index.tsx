import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Users, Clock } from "lucide-react";
import { useApprovals, type GroupedApproval } from "./hooks/useApprovals";
import { EmployeeApprovalDetail } from "./components/EmployeeApprovalDetail";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const Approvals = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    pendingApprovals, 
    groupedApprovals,
    loading, 
    handleApproveRating, 
    handleUpdateRating 
  } = useApprovals();

  const [selectedEmployee, setSelectedEmployee] = useState<GroupedApproval | null>(null);

  // Filter grouped approvals based on search term
  const filteredGroupedApprovals = groupedApprovals.filter(group => 
    group.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmployeeClick = (employee: GroupedApproval) => {
    setSelectedEmployee(employee);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tech Lead Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve skill ratings for your team
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-6 border-b">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Pending Approvals Summary</CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold">{pendingApprovals.length}</div>
                <p className="text-sm text-muted-foreground">Total pending</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{groupedApprovals.length}</div>
                <p className="text-sm text-muted-foreground">Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Employee List */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : filteredGroupedApprovals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground px-4">
                {searchTerm ? 'No employees match your search.' : 'No pending approvals at this time.'}
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredGroupedApprovals.map((employee) => (
                  <div 
                    key={employee.employeeId} 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedEmployee?.employeeId === employee.employeeId 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleEmployeeClick(employee)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{employee.employeeName}</p>
                        <Badge variant="secondary">
                          {employee.pendingCount}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {employee.submitDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Employee Details */}
        <div className="flex-1 flex flex-col">
          {selectedEmployee ? (
            <div className="flex flex-col h-full">
              {/* Employee Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedEmployee.employeeName}</h2>
                    <p className="text-muted-foreground">{selectedEmployee.email}</p>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {selectedEmployee.pendingCount} pending rating{selectedEmployee.pendingCount > 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>

              {/* Ratings List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {selectedEmployee.ratings.map((rating) => (
                    <Card key={rating.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{rating.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{rating.description}</p>
                              {rating.self_comment && (
                                <div className="mt-2 p-3 bg-muted rounded-md">
                                  <p className="text-sm">
                                    <span className="font-medium">Employee comment:</span> {rating.self_comment}
                                  </p>
                                </div>
                              )}
                            </div>
                            <Badge 
                              variant={rating.rating === 'high' ? 'default' : 'secondary'}
                              className="ml-4"
                            >
                              {rating.rating.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleApproveRating(rating.id)}
                              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Approve as {rating.rating.toUpperCase()}
                            </button>
                            <button
                              onClick={() => handleUpdateRating(rating.id, 'high', 'Updated by tech lead')}
                              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              HIGH
                            </button>
                            <button
                              onClick={() => handleUpdateRating(rating.id, 'medium', 'Updated by tech lead')}
                              className="px-3 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm font-medium"
                            >
                              MED
                            </button>
                            <button
                              onClick={() => handleUpdateRating(rating.id, 'low', 'Updated by tech lead')}
                              className="px-3 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors text-sm font-medium"
                            >
                              LOW
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select an employee to review their skill ratings</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Approvals;