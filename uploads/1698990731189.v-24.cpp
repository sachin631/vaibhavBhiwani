		    /////////////////////////////////////////////////
		    //             Step2Gen - Part 2               //
		    /////////////////////////////////////////////////
		    
// Q)  Sum of duplicate prime numbers in an array.
//     Example:
//     [20,3,81,9,2,9,3,3,66,11,5,90,5]
//     Answer in this case should be 8 = (5+3 = 8)

#include<bits/stdc++.h>
using namespace std;

bool isPrime(int x)
{
    for(int i=2;i<=sqrt(x);i++)
    {
        if(x%i == 0)
        return 0;
    }
    return 1;
}

int main()
{
	int a[]={20,3,81,9,2,9,3,3,66,11,5,90,5};
	int n=sizeof(a)/sizeof(a[0]);
	
	map<int , int> m;
	int temp=0;
	
	for(int i=0;i<n;i++)
	{
	    m[a[i]]++;
	}
		for(auto x : m)
		{
		    if(x.second > 1)
		    {
		        if(isPrime(x.first))
		        {
		            cout<<x.first<<" ";
		            temp+=x.first;
		        }
		    }
		}
		cout<<endl<<temp;
	return 0;
}
